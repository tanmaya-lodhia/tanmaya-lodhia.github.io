export const site = {
  name: "Tanmaya Lodhia",
  role: "Independent Quantitative Research",
  tagline: "Mathematics & Economics · University of Nottingham",
  blurb:
    "I write independent research on market microstructure, volatility, and asset pricing, and build the tools to test the ideas properly: from replication studies to a C++ order book engine.",
  stats: [
    { value: "3", label: "working papers" },
    { value: "99.9%", label: "order book reconstruction accuracy" },
    { value: "6.8M", label: "events/sec C++ engine throughput" },
    { value: "1", label: "strategy taken from paper to live paper-trading" },
  ],
  email: "tanmaya.lodhia@gmail.com",
  github: "https://github.com/tanmaya-lodhia",
  linkedin: "https://www.linkedin.com/in/tanmayalodhia",
  ssrn: "https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=11948088",
  headshot: "/images/headshot.jpg",
};

export type Status = "Working paper" | "In progress" | "On hold" | "Complete";

export type Card = {
  title: string;
  status?: Status;
  why?: string;
  summary: string;
  details: string[];
  tags: string[];
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
};

export const papers: Card[] = [
  {
    title:
      "Which Impact Models Survive Price Diffusivity? Stress-Testing the Structural Constraint of Bonart (2026) in Simulation and Public Data",
    status: "Working paper",
    why: "Impact models sit inside every execution algorithm. A model that violates price diffusivity systematically mis-prices the cost of trading.",
    summary:
      "Every trade moves prices, yet prices behave like a random walk. This paper stress-tests which market impact models can actually satisfy that constraint, in simulation and on real data.",
    details: [
      "Shows that all canonical impact models fail the diffusivity test, through two distinct failure modes: trending or mean-reverting price residuals.",
      "Identifies the surprise-response formulation as the repair, and replicates the linear-to-square-root impact crossover on Bitcoin and Ethereum using public Binance data.",
      "20-page paper with full replication code; externally reviewed before submission.",
    ],
    tags: ["Market microstructure", "Market impact", "Crypto"],
    image: {
      src: "/images/impact-sqrt-law.png",
      alt: "Square-root law of market impact fitted on crypto data",
    },
    link: { label: "View on GitHub", href: "https://github.com/tanmaya-lodhia/impact-diffusivity" },
  },
  {
    title:
      "Harvestable Premium or Crash Compensation? The Crypto Variance Risk Premium in Bitcoin and Ethereum",
    status: "Working paper",
    why: "Short-volatility strategies earn steady carry until they blow up. Knowing when the premium is genuine compensation and when it is crash bait is the whole game.",
    summary:
      "Option-implied volatility in crypto persistently exceeds what is subsequently realised. Is the gap free money for volatility sellers, or fair payment for carrying crash risk?",
    details: [
      "Builds the first BTC-vs-ETH decomposition of the crypto variance risk premium from Deribit's DVOL index (2021 onward) and realised volatility from tick-level Binance data.",
      "Finds Bitcoin's premium is harvestable: it survives measured transaction costs, delta-hedging frictions, and crash months. Ethereum's premium is crash compensation that fails every robustness leg.",
      "Extended into a live, defined-risk short-volatility strategy: signal engine, automated daily paper trading, and execution tooling.",
    ],
    tags: ["Volatility", "Options", "Derivatives"],
    image: {
      src: "/images/vrp-implied-realised.png",
      alt: "Implied versus subsequently realised volatility for Bitcoin",
    },
    link: { label: "View on GitHub", href: "https://github.com/tanmaya-lodhia/crypto-vrp" },
  },
  {
    title:
      "Coherent Drawdown-Adjusted Performance: Replication and Extension Across International Equity Markets",
    status: "Working paper",
    why: "Drawdown rules govern real allocation and manager-firing decisions. A metric that scores the COVID crash as an acceptable period is a dangerous metric.",
    summary:
      "The standard drawdown-adjusted return metric can rank a market crash as a mediocre but acceptable period. This paper replicates the flaw, verifies the proposed fix, and extends both internationally.",
    details: [
      "Independently replicates Varma (2025, Journal of Portfolio Management): during the COVID crash the conventional DAP metric scores SPY at the 25th percentile, while the corrected CDAP metric correctly flags it as catastrophic (0th percentile).",
      "Extends the analysis to Japanese, UK, German, and French equity ETFs and adds threshold and window sensitivity robustness the original paper lacked.",
    ],
    tags: ["Risk measurement", "Portfolio management", "Replication"],
    image: {
      src: "/images/drawdown-crisis.png",
      alt: "Crisis-period analysis of drawdown-adjusted performance metrics on SPY",
    },
    link: { label: "Read the paper (PDF)", href: "/papers/coherent-drawdown-adjusted-performance.pdf" },
  },
  {
    title: "Bayesian Ball-by-Ball Win Probability Modelling in T20 Cricket",
    status: "In progress",
    why: "A forecast is only useful if its probabilities mean what they say. In-play sports markets price these probabilities in real time, so calibration is directly testable.",
    summary:
      "A fully probabilistic in-match win probability model for T20 cricket, built from 7,000+ matches of ball-by-ball data, with calibration and honest uncertainty as the headline objectives rather than leaderboard accuracy.",
    details: [
      "Progresses from a logistic baseline to a hierarchical Bayesian model (batters, bowlers, teams, venues) estimated in PyMC.",
      "Evaluated by walk-forward-by-season log loss, Brier decomposition, and calibration error with match-level block bootstrap: the same standards a trading model would face.",
    ],
    tags: ["Bayesian statistics", "Forecasting", "Sports markets"],
    image: {
      src: "/images/cricket-heatmaps.png",
      alt: "Win probability heatmaps by match state in T20 chases",
    },
  },
  {
    title: "How Much Automated Alpha Discovery Survives Multiple-Testing Correction?",
    status: "In progress",
    why: "LLM-driven alpha discovery is booming. Without multiple-testing discipline, most of what these systems find is noise dressed up as signal.",
    summary:
      "When an automated loop, whether random search or an LLM reading its own backtest results, 'discovers' trading rules, how much survives a statistically honest audit? The audit is the paper.",
    details: [
      "Compares three search arms over an identical trading-rule grammar, with a pre-registered protocol and a locked 2025-26 holdout no experiment may touch.",
      "Every candidate rule faces the Deflated Sharpe Ratio, White's Reality Check, and the Superior Predictive Ability test before it can be called a finding.",
    ],
    tags: ["Data snooping", "Multiple testing", "LLM agents"],
  },
  {
    title: "Expectation Formation in In-Play Prediction Markets",
    status: "On hold",
    why: "Whether prices under- or over-react to news is a central question in behavioural finance, and most tests rely on messy survey data. Prediction markets offer a cleaner lab.",
    summary:
      "Do live prediction-market prices over- or under-react to news? Uses the half-time score in football as a clean, timestamped information shock across roughly 400 matches in seven leagues.",
    details: [
      "A candidate under-reaction result was deliberately not published after it failed a placebo test the project itself designed: a case study in letting robustness checks kill a result.",
      "Design and pre-registration are locked; the project resumes when an untouched out-of-sample data source becomes available.",
    ],
    tags: ["Behavioural finance", "Prediction markets", "Research integrity"],
  },
];

export const projects: Card[] = [
  {
    title: "Limit Order Book Engine",
    status: "Complete",
    why: "The order book is where prices actually form. Building one from raw exchange messages, rather than using a library, is the difference between knowing about microstructure and knowing it.",
    summary:
      "A from-scratch, full-depth limit order book reconstruction and matching engine in C++23, processing 6.8 million events per second with 99.9% top-of-book reconstruction accuracy.",
    details: [
      "Reconstructs the order book from raw NASDAQ (LOBSTER) message data with 99.9% agreement against the official reference, validated by a 50,000-step differential fuzz test between two independent implementations.",
      "Recovers the square-root law of market impact on real reconstructed books: fitted exponent 0.62 with R-squared 0.97 across 553,000 synthetic metaorders.",
      "Includes a price-time-priority matching engine and an optimised flat-array engine 1.5x faster than the baseline; 37 automated test suites, built with CMake and Ninja.",
    ],
    tags: ["C++23", "Exchange systems", "Market microstructure"],
    link: { label: "View on GitHub", href: "https://github.com/tanmaya-lodhia/lob-engine" },
  },
  {
    title: "Regime-Conditional Mean Reversion",
    status: "In progress",
    why: "Most published anomalies are averages over very different market conditions. Conditioning on regime asks the sharper question: when does this edge actually exist?",
    summary:
      "Combines a hidden Markov model of market regimes with a systematic short strategy on small-cap stocks that spike intraday, testing whether the edge only exists in certain market states.",
    details: [
      "Three-state Gaussian HMM trained on S&P 500 returns tags each day as bull, bear, or high volatility; the strategy shorts Russell 2000 stocks after 10%+ single-day gains with defined stop and holding rules.",
      "Backtested 2020 to 2024 across 151 tickers; the unconditional strategy loses money, but a regime-conditional edge emerges in high-volatility states. Now being tested with walk-forward, out-of-sample regime labels.",
    ],
    tags: ["Regime detection", "Systematic trading", "Python"],
    link: { label: "View on GitHub", href: "https://github.com/tanmaya-lodhia/hmm-mean-reversion" },
    image: {
      src: "/images/hmm-results.png",
      alt: "Backtest results of the regime-conditional mean reversion strategy",
    },
  },
  {
    title: "Convertible Bond Monte Carlo: Shopify",
    status: "Complete",
    why: "Convertible pricing is where equity analysis meets derivatives: the bond's value depends on a probability distribution, not a point forecast.",
    summary:
      "Monte Carlo simulation of Shopify's $920 million convertible bond, estimating the probability the conversion option finishes in the money.",
    details: [
      "Simulates 10,000 price paths under both geometric Brownian motion and a jump-diffusion process, capturing the fat-tailed moves a pure GBM model misses.",
      "Prices the conversion decision against the $144.01 conversion price and analyses the resulting distribution of outcomes for bondholders and the issuer.",
    ],
    tags: ["Monte Carlo", "Convertible bonds", "Derivatives pricing"],
    image: {
      src: "/images/shopify-mc-histogram.png",
      alt: "Distribution of simulated Shopify final prices from the Monte Carlo model",
    },
  },
];

export const pitches: Card[] = [
  {
    title: "Vistra Corp (VST): Long",
    summary:
      "Full stock pitch on the US integrated power producer, built around its nuclear and baseload generation fleet as AI data-centre demand tightens deregulated power markets.",
    details: [
      "Thesis: Vistra's large-scale baseload capacity, particularly nuclear, earns both contracted stability (PPAs, retail) and upside optionality to tight spot power markets such as ERCOT.",
      "Backed by a full DCF model with scenario and sensitivity analysis; target price $200 against $159.60 at pitch date.",
    ],
    tags: ["Equity research", "Power & utilities", "DCF"],
    image: {
      src: "/images/vistra-dcf-heatmap.png",
      alt: "DCF sensitivity heatmap from the Vistra valuation model",
    },
  },
  {
    title: "Nucor (NUE): Stock Pitch",
    summary:
      "Pitch on the largest US steel producer, centred on US steel tariffs and infrastructure spending as demand tailwinds for domestic mini-mill capacity.",
    details: [
      "Covers company overview, macro analysis of the 2025 tariff regime and the IIJA infrastructure pipeline, competitor benchmarking against peers, and SWOT.",
      "Emphasises Nucor's cost efficiency, diversified product mix, and balance-sheet strength relative to integrated peers.",
    ],
    tags: ["Equity research", "Steel & materials", "Macro"],
  },
  {
    title: "ArcelorMittal (MT): Stock Pitch",
    summary:
      "Companion pitch in the steel sector, analysing the world's second-largest steelmaker as a European counterpoint to the Nucor thesis.",
    details: [
      "Examines how US tariff policy reshapes global steel trade flows and what that means for a globally diversified producer versus a domestic pure-play.",
    ],
    tags: ["Equity research", "Steel & materials"],
  },
  {
    title: "Happy Hour Co: M&A Valuation Case",
    summary:
      "Sell-side style valuation of a Singaporean beverages producer with a majority stake up for sale, prepared as a full deal pack.",
    details: [
      "Built a three-statement operating forecast and DCF valuation for the market-leading beer and spirits producer across Singapore, Malaysia, and China.",
      "Distilled the analysis into a two-page deal profile covering ownership structure (60% family stake for sale), competitive position, and valuation range.",
    ],
    tags: ["M&A", "DCF", "Consumer & retail"],
  },
  {
    title: "Klaviyo & Faire: Company Overview Slides",
    summary:
      "Company overview and pitch slides on two US growth-stage technology names, covering business model, unit economics, and competitive positioning.",
    details: [
      "Klaviyo: marketing automation platform monetising e-commerce data; Faire: online wholesale marketplace connecting independent retailers and brands.",
    ],
    tags: ["Equity research", "Technology"],
  },
];

export const skills = [
  {
    group: "Research & analysis",
    items: [
      "Econometrics (HAC inference, bootstrap, multiple-testing correction)",
      "Bayesian modelling (PyMC, hierarchical models)",
      "Backtesting & strategy evaluation",
      "Replication studies & robustness design",
    ],
  },
  {
    group: "Finance & valuation",
    items: [
      "DCF and three-statement modelling",
      "M&A and deal analysis",
      "Stock pitching & equity research",
      "Derivatives pricing (Monte Carlo, Black-Scholes)",
    ],
  },
  {
    group: "Engineering",
    items: [
      "Python (pandas, NumPy, statsmodels)",
      "C++23 (low-latency data structures)",
      "Data pipelines & market-data APIs",
      "Git, CMake, automated testing",
    ],
  },
  {
    group: "Communication",
    items: [
      "Academic writing (LaTeX, SSRN working papers)",
      "Pitch decks & deal two-pagers",
      "Translating technical results for non-specialist readers",
    ],
  },
];
