---
title: "The Market Is Not a Price. It Is a Queue."
description: "Notes from building an order book from raw exchange messages: on price-time priority, missing floorboards, and a bug that taught more than the working code did."
category: research-notes
tags: ["market microstructure", "C++", "order books"]
---

Close your eyes for a moment.

Imagine you are the exchange.

Not a trader. Not a bank. Not some analyst staring at a Bloomberg terminal pretending the yield curve has developed feelings.

The exchange.

You sit at the centre of the market, watching thousands of people scream through machines. Some want to buy. Some want to sell. Some want to cancel what they just said because, tragically, reality has updated in the last three microseconds.

Everyone thinks the market is about price.

Cute. But no.

The market is about order.

Who arrived first. Who gets filled. Who disappears. Who was visible. Who was hidden. Who stood patiently in the queue and who got erased below the depth of the feed like a minor aristocrat after a revolution.

Price is just the headline. The limit order book is the machinery underneath. And like most machinery underneath polite civilisation, it is less elegant than advertised and much more important than anyone wants to admit.

This project started with a simple question: could I reconstruct a real limit order book from raw market messages, event by event, in C++?

Not approximate it. Not draw a few candlesticks and call it microstructure because the chart looked vaguely institutional.

Reconstruct it. Every add. Every cancel. Every execution. Every level. Every queue. The actual skeleton of the market.

## Price: The Official Story

The official story of markets is beautifully simple.

A stock has a price. You open an app, see a number, and think: there it is. The truth. The collective wisdom of civilisation distilled into £187.43 and a tiny green arrow.

Very reassuring. Also mostly theatre.

A traded price is not the market. It is merely the last place where two people briefly agreed before immediately regretting it. The real market lives in the limit order book: a continuously updating queue of buyers and sellers, sorted by price and then by time.

Better prices go first. At the same price, older orders go first. A master. A flag. A god. A queue. That is the civilisation.

If you want to understand the market properly, you cannot just watch the trades. Trades are the visible blood splatter. The order book is the anatomy.

So the project began there: build the anatomy.

## Messages: The Market's Nervous System

The market does not hand you meaning. That would be too generous. Terrible precedent.

Instead, it gives you messages. A new visible limit order arrives. A partial cancellation reduces quantity. A full deletion removes an order. A visible order executes. A hidden order executes and, naturally, changes nothing visible because why make life pleasant? Auctions and halts appear as special events. The market blinks, twitches, adjusts. One event at a time.

The job of a reconstruction engine is to consume that stream and rebuild the book after each message. Not the book as your model assumes for mathematical convenience. Not the book as your backtest wishes it had been. The book implied by the actual event stream.

This sounds simple until you realise that finance specialises in making simple things disgusting. An order is not just a price and a quantity. It has an ID. It has a side. It belongs to a price level. It occupies a position in a FIFO queue. It may be partially reduced. It may be cancelled entirely. It may execute. It may have existed before your data window began, which is always charming, like being asked to solve a murder mystery where half the suspects were born before the camera turned on.

So the engine needs memory. Not metaphorical memory. Actual memory.

It needs to know where every order is, how much quantity remains, what price level it belongs to, and where it sits in the queue. Because if a cancellation arrives by order ID, the engine cannot shrug and start searching the whole book like a confused librarian during an air raid. It has to find the order immediately.

So the core design uses integer tick prices, not floats. Because using floating point numbers as keys in a financial data structure is one of those ideas that feels fine until the lawsuit.

Prices become exact integer ticks. Each price level holds a FIFO queue. Each order can be found by ID. Cancels and reductions happen in O(1). Strict price time priority is preserved.

That is the dull sounding engineering decision. And that was the whole point. Because market structure is one of those domains where being "mostly right" is just a more expensive way of being wrong.

## The Book: Civilisation as a Data Structure

At first, the obvious version is the honest version.

Use `std::map` for price levels. One map for bids, one map for asks. The best bid is the highest bid. The best ask is the lowest ask. Let the standard library do the sorting and enjoy the temporary illusion that life is good.

Then each price level stores its orders as an intrusive doubly linked list.

That phrase sounds like something a Victorian surgeon would invent after being rejected by polite society, but the idea is simple.

The queue needs to preserve time priority. First order in, first order out. But cancellations can happen to any order, anywhere in the queue. If you store the queue naively, cancelling an arbitrary order means walking through the list looking for it, which is fine if your market is three people in a pub and catastrophic if it is NASDAQ.

So each order carries its own links. The order ID map points straight to the order. The order knows its neighbours. Cancellation becomes surgery, not archaeology. Find the node. Cut it out. Stitch the neighbours together. Move on.

No drama. No scanning. No "let us hope this is fast enough". Because hope is not an algorithm.

This baseline version matters because it is readable, correct, and conceptually clean. It gives you a reference implementation: the sensible constitution before the optimisation lobby arrives with knives.

And eventually, the optimisation lobby always arrives.

## Validation: Trust, But With an Oracle

Here is the problem with building market infrastructure projects.

You can write tests. You can invent toy cases. You can prove that your tiny three order book behaves correctly when Alice buys, Bob sells, and Charlie cancels because he has commitment issues.

Lovely. But the market does not care about your toy cases.

The market is not a classroom example. It is a live bureaucracy of noise, partial information, edge cases, and people trying to be first for reasons that are usually legal.

So the real question is not whether the engine works on a hand written scenario. The real question is whether it can replay real market data and agree with an external source.

This is where LOBSTER matters. LOBSTER provides NASDAQ sample data with both the message stream and the resulting book snapshots. That means the engine can seed from the first snapshot, replay every message, and compare its reconstructed book against LOBSTER's own state after each event.

An oracle. Not in the mystical sense. More in the "someone else already did the accounting, so let us see if you are lying to yourself" sense.

On the level-50 AAPL sample, the top of book matches 99.9% of the time and is exact for the first 54,605 events in a row.

Which sounds excellent. And then, naturally, there is a small issue.

## Depth: The Missing Floorboards

A limit order book data feed is not always full reality. That would be too helpful.

LOBSTER samples are sold at fixed depths: 10 levels, 50 levels, and so on. The feed reports activity that touches those visible levels. But if something happens below that depth, the message may not appear in your stream.

This creates a delightful philosophical problem.

Suppose an ask order is visible at level 9. Then better asks arrive above it, pushing it down to level 12. While it is below the reported depth, it gets removed. But because it is now outside the visible window, the feed does not tell you.

Later, the better asks disappear, and the book should reveal what is now at level 10.

Your engine still thinks the old order is there. It is not. The market knows. LOBSTER knows. You do not. Very convenient.

This is not a bug in the reconstruction engine. It is missing information. The feed never gave you the event. The system is not wrong because it reasoned badly; it is wrong because reality withheld evidence. Which, to be fair, is also how most macroeconomic forecasts are produced.

The fix is not magic. The fix is humility.

Seed deeper than you validate. Use 50 levels to protect the top of book. Validate the inside, not the entire fantasy. Accept that a level-N feed is not full reality, and design your checks around the information you actually possess.

This was one of the more important lessons from the project: correctness is not just about code. It is about knowing what your data can and cannot prove.

Because the market is not a clean laboratory. It is a partially observed machine operated by people with incentives.

Small issue.

## Speed: When Correctness Gets Expensive

Once the reference engine works, the next question arrives. Can it be faster?

Of course it can. Everything can be faster. That is how computer science keeps its funding.

The baseline `std::map` version is correct and clean, but it is not the final form. A red-black tree is fine when you want ordered keys and civilised asymptotics. But in a hot replay loop, every pointer chase, allocation, cache miss, and lookup becomes a small tax. And markets are very good at taxing people.

So the project adds `FlatBook`: an optimised version that keeps the same semantics but swaps the underlying machinery.

Instead of tree based price levels, it uses flat arrays indexed by tick offset. Instead of allocating order nodes all over the heap like confetti after a corporate restructuring, it uses a pooled vector with a free list.

The point is not to make the code look clever. The point is to make the memory layout stop sabotaging the CPU.

Modern processors are fast, but they are also deeply petty. Give them contiguous memory and they behave like obedient servants. Make them chase pointers across the heap and they start moving like a government department asked to modernise its procurement software.

Flat arrays improve locality. Object pools reduce allocation. The hot path becomes less theatrical.

On the level-10 full day AAPL sample, the flat version runs about 1.5 times faster than the `std::map` baseline. Nice.

But again, there is a catch. There is always a catch. Otherwise it would be marketing.

A fixed flat array works well when the relevant price band is compact. But if the price range is wide, you end up dragging around mostly empty memory and occasionally scanning through dead space like an archaeologist looking for liquidity.

The natural next upgrade is a windowed or recentering array. Because systems evolve. First correctness. Then speed. Then speed without pretending the world is always narrow.

## Differential Testing: Making Two Machines Argue

Optimisation is dangerous because it creates confidence.

A slow correct implementation is annoying. A fast wrong implementation is a weapon.

So the flat book cannot simply be benchmarked and admired. It has to be checked against the reference engine event by event. Both books replay the same stream. Both produce quotes. Their outputs are checksummed. If they disagree, something is wrong.

This is where a good bug appeared.

A single shared price array seemed plausible. Very tidy. Very efficient. Very wrong.

The problem is that raw event streams can produce transient crossed books. A price can appear on both sides in ways that break the assumption that one shared level per price is enough. If the array cannot represent separate bid and ask state at the same price, the best-ask scan can land on bid liquidity.

Naturally, this was unacceptable.

The differential test caught it. The fix was to use separate arrays per side.

This is the kind of bug that teaches more than the working code does. Not because it is dramatic, but because it reveals how markets punish assumptions that sound reasonable in a meeting.

One array per price is elegant. The market does not care.

## Microstructure: The Market Starts Confessing

Once the book can be reconstructed, it becomes more than an engineering object. It becomes an instrument.

Now you can measure the market from the inside. Not just returns. Not just volatility. Not just pretty candlesticks drawn after the fact like cave paintings for investment analysts.

You can measure spread, depth, trade signs, response functions, and how price moves after buying or selling pressure.

This is where the project turns from "I built a data structure" into "I rebuilt the machine so I could interrogate it".

The microstructure tool measures standard empirical features from the reconstructed book. On the AAPL sample, it recovers familiar stylised facts: trade-sign autocorrelation starts high and decays slowly, impact is concave and saturating, and effective spread comes in below quoted spread.

Translated into human language: order flow has memory, price impact is not linear, and trades often happen inside the visible spread.

The market, despite its love of noise, is not random soup. It has structure. And once you reconstruct the book, you can see that structure.

This matters because financial markets are often described in the language of equilibrium, efficiency, and rational pricing. Very noble. Very clean. Very suitable for people who have never watched a raw message stream for more than eight seconds.

At the microscopic level, the market looks less like a divine calculator and more like a crowd trying to squeeze through a doorway in strict timestamp order.

The price is not handed down from Olympus. It is beaten into existence by a sequence of tiny state transitions.

## Impact: The Myth of the Gentle Trade

The next stage is market impact.

Everyone wants liquidity until they have to use it.

A small trade can slip quietly through the book. A large order has a more awkward social presence. It consumes liquidity, signals pressure, and changes the future path of prices. In other words, the market notices.

The old clean model would like impact to be linear. Trade twice as much, move price twice as far. Cute. But no.

Empirically, market impact is famously concave. Larger orders move prices more, but less than proportionally. The square-root law says impact tends to scale roughly with the square root of traded volume.

This project reproduces a version of that result using the Maitrier-Loeper-Bouchaud construction. Real metaorder data is usually proprietary, because financial markets enjoy transparency in roughly the same way vampires enjoy sunrise. The construction gets around this by assigning trades randomly to synthetic traders and treating same-sign runs as metaorders.

It is not claiming to know the true trader identities. It is asking whether the statistical shape of impact emerges from the public tape.

And it does.

On the AAPL one-hour sample, the impact curve is strongly concave. In the scaling region, the fitted exponent is around 0.62 with an R-squared of 0.97.

Not exactly 0.5. Not a multi year institutional dataset. Not a Nobel Prize in a GitHub repo.

But enough to show that the reconstructed book can support an end to end impact study: raw messages in, book rebuilt, trades reconstructed, metaorders approximated, impact curve measured.

That is the serious point. The engine is not just replaying events for sport. It is turning market plumbing into empirical evidence.

## Matching: When the Machine Stops Watching and Starts Deciding

Reconstruction is passive. It watches what the exchange already decided and rebuilds the result.

The matching engine is different. It decides.

Incoming orders cross the book by price-time priority. Best price first. Oldest resting order first. Fills occur at the maker price. Limit and market orders are supported. Time in force rules like GTC, IOC, and FOK determine whether the residual rests, disappears, or refuses to exist unless fully filled.

Very civilised. In the same way a guillotine is civilised because at least it is consistent.

The matching engine reuses the same order book storage rather than inventing a parallel reality. That is important. A trading system should not have two versions of truth unless it is applying for a senior position in government.

But reconstruction and matching remain separate modules.

This separation matters. The reconstruction path must stay pure: it consumes already-matched events and validates against the external oracle. The matching path is the complement: it creates matches from incoming orders.

One watches the institution. One becomes the institution.

## What I Actually Built

So, stripped of the drama, here is what the project does.

It builds a C++23 limit order book reconstruction engine that consumes raw exchange-style messages and rebuilds the order book after every event.

The core book uses integer ticks for prices, per-side price levels, FIFO queues within each level, and an order-ID lookup system for fast cancels and reductions. It preserves strict price-time priority, because without that, you have not built an order book. You have built a vibes container.

It validates against LOBSTER NASDAQ samples by seeding from a published snapshot, replaying message events, and comparing the reconstructed book to LOBSTER's own book snapshots. It demonstrates very high top-of-book agreement on the level-50 AAPL sample, while also documenting why fixed-depth data necessarily creates reconstruction errors when liquidity disappears below the reported window.

It implements a faster flat-array version of the book and benchmarks it against the `std::map` reference implementation, using event-by-event checksums to ensure the speedup does not come from casually deleting correctness, the classic finance industry productivity hack.

It adds microstructure analytics: spreads, depth, trade-sign autocorrelation, response functions, and impact by size.

It reproduces square-root-like market impact using reconstructed trades and synthetic metaorders.

It includes a matching engine that supports price-time priority crossing, market and limit orders, and common time-in-force rules.

It is not a trading bot. It is not claiming secret alpha. It is not promising to defeat Citadel from a student bedroom with CMake and moral courage.

It is something more useful: a reconstruction engine that treats the market as a precise state machine and then uses that machine to study real microstructure.

Which is less glamorous. And therefore more credible.

## The Final Lesson

A lot of finance education starts too high up.

You learn returns before trades. Volatility before queues. Portfolios before matching. CAPM before anyone admits that the "market portfolio" does not cancel your order when the queue moves against you.

The result is that people can talk fluently about risk premia while having no idea how a price actually changes.

Building a reconstruction engine is a useful antidote to abstraction overdose.

It forces you to confront the market at the level where decisions become state changes. It teaches that liquidity is not a decorative word in an equity research note. It is quantity at price, with priority, visibility, and fragility.

It teaches that data limitations are not footnotes. They are structural facts.

It teaches that performance is not just Big-O notation. It is memory layout, cache behaviour, allocation, and whether the CPU is being asked to perform interpretive dance through a red-black tree.

And it teaches that a market is not efficient because someone in a textbook declared it so. It is efficient, or not, because millions of tiny mechanical interactions aggregate into something that looks like information.

Sometimes. On good days. With caveats.

The market is not the number on the screen. The number is the scar tissue.

The real action is underneath: orders arriving, vanishing, executing, reshuffling priority, leaking information, consuming liquidity, and turning human urgency into machine-readable events.

The book remembers. The queue decides. The price merely confesses.
