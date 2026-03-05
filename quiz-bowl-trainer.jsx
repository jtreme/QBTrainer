import { useState, useEffect, useRef, useCallback } from "react";

// ─── ROUND DATA (Rounds 1-4 from uploaded PDFs) ─────────────────────
const CATEGORIES = ["Microeconomics","Macroeconomics","Agribusiness/Finance","Resource/Policy","Quantitative","Marketing","Management","Potpourri"];
const POINT_VALUES = [5,10,15,20,25];

const MOCK_ROUNDS = [
  { name: "Round 1", questions: [
    {cat:"Microeconomics",pts:5,type:"buzzer",q:"What measures how a firm transforms inputs into output?",a:"Production function"},
    {cat:"Microeconomics",pts:10,type:"buzzer",q:"At what point on a linear demand curve does demand switch from elastic to inelastic?",a:"The midpoint"},
    {cat:"Microeconomics",pts:15,type:"buzzer",q:"Suppose you are willing to give up ten units of food for one unit of shelter. The price of food is 10 and the price of shelter is 50. Are you at an optimum?",a:"No — the MRS does not equal the price ratio"},
    {cat:"Microeconomics",pts:20,type:"mc",q:"In a Cournot duopoly, if the marginal cost of producing is zero, how much will the firm produce if it concedes all production to its opponent?",a:"C",options:["cd","ce","de","Impossible to tell"]},
    {cat:"Microeconomics",pts:25,type:"mc",q:"For an increasing cost industry, the long-run supply curve has a(n) ____ elasticity of supply.",a:"C",options:["Infinite","Negative","Positive","Zero"]},
    {cat:"Macroeconomics",pts:5,type:"buzzer",q:"What term describes the recurring pattern of expansion and contraction in economic activity?",a:"Business cycles"},
    {cat:"Macroeconomics",pts:10,type:"fill",q:"A point inside the production possibilities frontier is attainable but ________.",a:"inefficient"},
    {cat:"Macroeconomics",pts:15,type:"buzzer",q:"Core inflation excludes price changes from which two sectors?",a:"Food and energy"},
    {cat:"Macroeconomics",pts:20,type:"buzzer",q:"What term refers to the output the economy would produce at full employment?",a:"Potential GDP"},
    {cat:"Macroeconomics",pts:25,type:"mc",q:"When actual GDP exceeds potential GDP, the economy is experiencing:",a:"C",options:["A recessionary gap","A full-employment equilibrium","An inflationary gap","An equilibrium at the economy's physical limits"]},
    {cat:"Agribusiness/Finance",pts:5,type:"buzzer",q:"What is a contract that gives its owner the right (but not the obligation) to buy or sell an asset at a fixed price on or before a given date?",a:"Option"},
    {cat:"Agribusiness/Finance",pts:10,type:"mc",q:"Which of the following is an asset?",a:"A",options:["Accounts receivable","Accounts payable","Common stock","Dividends"]},
    {cat:"Agribusiness/Finance",pts:15,type:"mc",q:"Which of the following is considered a liquidity ratio?",a:"C",options:["Return on assets","Fixed asset turnover","Cash ratio","Times interest earned"]},
    {cat:"Agribusiness/Finance",pts:20,type:"buzzer",q:"What ratios measure the speed with which various accounts are converted into sales or cash?",a:"Activity ratios"},
    {cat:"Agribusiness/Finance",pts:25,type:"buzzer",q:"What type of analysis involves expressing income statement items as a percentage of sales and balance sheet items as a percentage of total assets?",a:"Common-size analysis"},
    {cat:"Resource/Policy",pts:5,type:"fill",q:"A cost or benefit imposed on third parties from some activity is called a(n) __________.",a:"externality"},
    {cat:"Resource/Policy",pts:10,type:"mc",q:"Economic rent is the same as which concept?",a:"A",options:["Producer surplus","Consumer surplus","Economic profit","Value of marginal product"]},
    {cat:"Resource/Policy",pts:15,type:"buzzer",q:"What type of pollution comes from diffuse sources that cannot be traced to a single point of discharge?",a:"Nonpoint source pollution"},
    {cat:"Resource/Policy",pts:20,type:"buzzer",q:"If the marginal social cost of fertilizer exceeds the marginal private cost, is the market producing too much or too little fertilizer?",a:"Too much"},
    {cat:"Resource/Policy",pts:25,type:"buzzer",q:"Two citizens have identical willingness to pay P = 20 – 2Q for a public good. If MC = 20, how much should be provided?",a:"5 units (vertical summation: P = 40 – 4Q = 20 → Q = 5)"},
    {cat:"Quantitative",pts:5,type:"fill",q:"The ________ function indicates the maximum output per unit of time a firm can produce for every combination of inputs.",a:"production"},
    {cat:"Quantitative",pts:10,type:"buzzer",q:"If MPL = 50 chips/hr and MPK = 100 chips/hr, what is the MRTS of capital for labor?",a:"2"},
    {cat:"Quantitative",pts:15,type:"buzzer",q:"If ATC = 50, quantity = 10, and TFC = 100, what is total variable cost?",a:"400"},
    {cat:"Quantitative",pts:20,type:"buzzer",q:"If disposable income rises from $10,000 to $15,000 and consumption rises from $9,000 to $12,000, what is the MPC?",a:"0.6"},
    {cat:"Quantitative",pts:25,type:"buzzer",q:"If k (money demand per dollar of income) = 0.2 and money supply = $1,000, what is nominal GDP?",a:"$5,000"},
    {cat:"Marketing",pts:5,type:"buzzer",q:"What is undifferentiated marketing more commonly known as?",a:"Mass marketing"},
    {cat:"Marketing",pts:10,type:"mc",q:"Lifestyle is an example of which type of segmentation variable?",a:"A",options:["Psychographic","Demographic","Usage","Behavioral"]},
    {cat:"Marketing",pts:15,type:"fill",q:"An easily identifiable logo, distinctive packaging, and consistent color scheme combine to form a brand's __________.",a:"brand identity"},
    {cat:"Marketing",pts:20,type:"buzzer",q:"A pull strategy is a communications strategy aimed at __________.",a:"Consumers"},
    {cat:"Marketing",pts:25,type:"buzzer",q:"Advertising, public relations, and sales promotion are three of the four traditional promotional mix techniques. What is the fourth?",a:"Personal selling"},
    {cat:"Management",pts:5,type:"mc",q:"In a 360-degree evaluation, who rates a person's skill and performance?",a:"D",options:["Colleagues","Direct reports","Superiors","All of the above"]},
    {cat:"Management",pts:10,type:"buzzer",q:"When a manager monitors work performance to determine if quality is 'up to standard,' they are engaging in which management function?",a:"Controlling"},
    {cat:"Management",pts:15,type:"buzzer",q:"What involves the tasks of attracting, recruiting, and retaining employees?",a:"Human resource management"},
    {cat:"Management",pts:20,type:"fill",q:"Modes of behavior that are acceptable to and shared by group members are called __________.",a:"norms"},
    {cat:"Management",pts:25,type:"mc",q:"What is the guiding principle of scientific management?",a:"D",options:["Experimentation","Fluid working relationships","Freedom of association","One best way to do a job"]},
    {cat:"Potpourri",pts:5,type:"buzzer",q:"Georgia leads the nation in the production of what row crop (both quantity and value)?",a:"Peanuts"},
    {cat:"Potpourri",pts:10,type:"buzzer",q:"What does the acronym NIMBY stand for?",a:"Not In My Backyard"},
    {cat:"Potpourri",pts:15,type:"buzzer",q:"What 9-letter word means simultaneously buying an asset in one market and selling it in another to exploit price differences?",a:"Arbitrage"},
    {cat:"Potpourri",pts:20,type:"buzzer",q:"After the U.S. and China, what nation has the third-largest GDP?",a:"Japan"},
    {cat:"Potpourri",pts:25,type:"fill",q:"You buy a new car and your neighbor feels poorer until they get one too. This is an example of a __________ externality.",a:"positional"},
  ]},
  { name: "Round 2", questions: [
    {cat:"Microeconomics",pts:5,type:"buzzer",q:"What is this firm's shut-down price if the minimum AVC is $4?",a:"$4"},
    {cat:"Microeconomics",pts:10,type:"buzzer",q:"If your marginal benefit from drinking Coke is given in a table and the price is $1.00, and the 2nd Coke has MB=$1 while the 3rd has MB<$1, what is the optimal number?",a:"2"},
    {cat:"Microeconomics",pts:15,type:"buzzer",q:"If your daily marginal benefit from drinking coffee increases by $2 per cup, what happens to your demand curve?",a:"It shifts to the right by $2"},
    {cat:"Microeconomics",pts:20,type:"mc",q:"If a decrease in the price of good Y causes a consumer to buy less of good X, goods X and Y are:",a:"A",options:["Substitutes","Complements","Neither substitutes nor complements","None of the above"]},
    {cat:"Microeconomics",pts:25,type:"mc",q:"The Chamberlin model of monopolistic competition is like perfect competition in that it assumes:",a:"B",options:["Homogeneous products","Ease of entry and exit","A horizontal demand curve for the firm","All of the above"]},
    {cat:"Macroeconomics",pts:5,type:"fill",q:"A(n) ________ in the business cycle occurs when employment and output reach their lowest levels.",a:"trough"},
    {cat:"Macroeconomics",pts:10,type:"buzzer",q:"If the minimum wage rose from $6 to $7 in a labor market, and the quantity of labor supplied increases by 20 while quantity demanded falls by 20, unemployment would rise by how much?",a:"40"},
    {cat:"Macroeconomics",pts:15,type:"buzzer",q:"On a PPF diagram, which movement — from an interior point to a point on the frontier, or from one frontier to a new expanded frontier — represents economic growth?",a:"Movement to a new expanded frontier"},
    {cat:"Macroeconomics",pts:20,type:"mc",q:"Which equation always represents GDP in an open economy?",a:"D",options:["S = I - G","I = Y - C + G","Y = C + I + G","Y = C + I + G + NX"]},
    {cat:"Macroeconomics",pts:25,type:"buzzer",q:"If the economy is in long-run equilibrium and there is a monetary contraction, what happens in the long run?",a:"The economy returns to the original output level but at a lower price level"},
    {cat:"Agribusiness/Finance",pts:5,type:"buzzer",q:"What is the price at which one country's currency can be traded for another known as?",a:"Exchange rate"},
    {cat:"Agribusiness/Finance",pts:10,type:"buzzer",q:"What provides the main revenue-generating asset category for banks?",a:"Loans"},
    {cat:"Agribusiness/Finance",pts:15,type:"buzzer",q:"What is a legally binding agreement to sell an asset for a specified price on a specified date?",a:"Forward contract"},
    {cat:"Agribusiness/Finance",pts:20,type:"buzzer",q:"When a lending institution assesses whether a borrowing firm's management is trustworthy, which of the 'Five Cs' is it focusing on?",a:"Character"},
    {cat:"Agribusiness/Finance",pts:25,type:"fill",q:"In a call option contract, the price at which the option owner can buy the underlying stock is called the ________ price.",a:"exercise (or strike)"},
    {cat:"Resource/Policy",pts:5,type:"fill",q:"The amount that a consumer pays to consume an additional unit of a good is the marginal ________ cost.",a:"private"},
    {cat:"Resource/Policy",pts:10,type:"mc",q:"If firms do not have to account for external costs in production, they will produce an output level that is ________ the efficient level.",a:"C",options:["At","Below","Above","Either above or below"]},
    {cat:"Resource/Policy",pts:15,type:"buzzer",q:"If an industry has four firms with market shares of 40%, 30%, 20%, and 10%, what is the Herfindahl index?",a:"3,000"},
    {cat:"Resource/Policy",pts:20,type:"buzzer",q:"To force a firm to produce the efficient level of output when there is a negative externality, the government should impose a per-unit tax equal to what?",a:"The marginal external cost at the efficient quantity"},
    {cat:"Resource/Policy",pts:25,type:"buzzer",q:"To internalize externalities, the government should do what to activities with negative externalities and what to activities with positive externalities?",a:"Tax negative externalities; subsidize positive externalities"},
    {cat:"Quantitative",pts:5,type:"buzzer",q:"Wilbur's Widgets produces 100 widgets. AFC is $6 and TVC is $400. What is total cost?",a:"$1,000"},
    {cat:"Quantitative",pts:10,type:"buzzer",q:"If TC(Q) = 5 + Q, what is the expression for ATC?",a:"(5/Q) + 1"},
    {cat:"Quantitative",pts:15,type:"buzzer",q:"At $20, a store sells 24 picture frames. At $18, it sells 33. Since total revenue increases following the price decrease, demand must be what?",a:"Elastic"},
    {cat:"Quantitative",pts:20,type:"buzzer",q:"If Q = 4KL, what is the marginal product of capital when L = 4?",a:"16"},
    {cat:"Quantitative",pts:25,type:"fill",q:"The economic concept that corresponds most closely to a 'derivative' in calculus is the concept of a(n) ________ value.",a:"marginal"},
    {cat:"Marketing",pts:5,type:"mc",q:"When a manager focuses on making easy-to-produce products and then tries to sell them, that manager has a __________ orientation.",a:"B",options:["Marketing","Production","Sales","Profit"]},
    {cat:"Marketing",pts:10,type:"buzzer",q:"Positioning refers to how __________ think about proposed and/or present brands in a market.",a:"Customers"},
    {cat:"Marketing",pts:15,type:"buzzer",q:"What type of utility is provided when a good or service is obtained and there is a right to use or consume it?",a:"Possession utility"},
    {cat:"Marketing",pts:20,type:"buzzer",q:"In marketing, what is a product's route through the supply chain known as?",a:"Distribution channel"},
    {cat:"Marketing",pts:25,type:"buzzer",q:"What is sometimes referred to as the 'silent salesman' because of its marketing communications role?",a:"Packaging"},
    {cat:"Management",pts:5,type:"mc",q:"Which of the following is NOT a recognized type of plan?",a:"C",options:["Business","Succession","Ad hoc","Financial"]},
    {cat:"Management",pts:10,type:"buzzer",q:"In a SWOT analysis, which two elements are part of the internal environment?",a:"Strengths and weaknesses"},
    {cat:"Management",pts:15,type:"mc",q:"Individual freedom to schedule work is an example of:",a:"B",options:["Job design","Job enrichment","Job rate","Job planning"]},
    {cat:"Management",pts:20,type:"buzzer",q:"What is the term for a sub-optimal but acceptable outcome of negotiations between parties?",a:"Satisficing"},
    {cat:"Management",pts:25,type:"mc",q:"How can you describe the thinking and outlook of transformational leaders?",a:"A",options:["Strategic","Operational","Functional","Developmental"]},
    {cat:"Potpourri",pts:5,type:"buzzer",q:"How many Federal Reserve banks are there in the U.S.?",a:"12"},
    {cat:"Potpourri",pts:10,type:"buzzer",q:"What video game character was originally known as Jumpman?",a:"Mario"},
    {cat:"Potpourri",pts:15,type:"mc",q:"Which European country does NOT use the Euro as its main currency?",a:"C",options:["Germany","France","United Kingdom","Ireland"]},
    {cat:"Potpourri",pts:20,type:"mc",q:"The most important source of average labor productivity improvement is:",a:"A",options:["Technology","Entrepreneurship and management","Human capital","Physical capital"]},
    {cat:"Potpourri",pts:25,type:"buzzer",q:"What term is defined as the total value of a publicly traded company's outstanding common shares owned by stockholders?",a:"Market capitalization"},
  ]},
  { name: "Round 3", questions: [
    {cat:"Microeconomics",pts:5,type:"mc",q:"Which of the following CANNOT result in a shift of the demand curve for a good?",a:"B",options:["A change in consumers' incomes","A change in the price of the good","A change in the price of a complement","All of the above"]},
    {cat:"Microeconomics",pts:10,type:"mc",q:"If an input is owned and used by a firm, then its ________ cost is zero.",a:"A",options:["Explicit","Implicit","Opportunity","Economic"]},
    {cat:"Microeconomics",pts:15,type:"buzzer",q:"If coconuts and pineapples are substitutes and the price of pineapples increases, what happens in the market for coconuts?",a:"Demand for coconuts increases (shifts right)"},
    {cat:"Microeconomics",pts:20,type:"buzzer",q:"If all firms in an industry have identical cost curves and each firm produces 5 units at minimum ATC, and market demand at that price is 100 units, how many firms operate?",a:"20"},
    {cat:"Microeconomics",pts:25,type:"buzzer",q:"In long-run equilibrium under perfect competition, a firm earns zero economic profit. At which points on the cost curve does this occur?",a:"Where P = MC = minimum ATC"},
    {cat:"Macroeconomics",pts:5,type:"buzzer",q:"What is best described as the market value of all final goods and services produced within a nation in a given year?",a:"Gross domestic product (GDP)"},
    {cat:"Macroeconomics",pts:10,type:"mc",q:"A tax where the rate stays the same regardless of income is:",a:"B",options:["Regressive","Proportional","Progressive","Optimal"]},
    {cat:"Macroeconomics",pts:15,type:"mc",q:"An increase in income tax rates would shift the aggregate demand curve in which direction?",a:"B",options:["Right (increase)","Left (decrease)","No change","Indeterminate"]},
    {cat:"Macroeconomics",pts:20,type:"buzzer",q:"In the circular flow model, which flow represents consumer expenditures?",a:"The flow from households to the product market"},
    {cat:"Macroeconomics",pts:25,type:"buzzer",q:"If war in the Middle East sends oil prices spiraling upwards, resulting in a rise in the overall price level, this is an example of what type of inflation?",a:"Cost-push inflation"},
    {cat:"Agribusiness/Finance",pts:5,type:"buzzer",q:"What regulatory body provides deposit insurance to commercial banks?",a:"FDIC"},
    {cat:"Agribusiness/Finance",pts:10,type:"buzzer",q:"What financial statement is sometimes referred to as the statement of financial position?",a:"Balance sheet"},
    {cat:"Agribusiness/Finance",pts:15,type:"buzzer",q:"What is a supplemental retirement plan offered by an employer where the employee chooses how funds are invested?",a:"401(k) plan"},
    {cat:"Agribusiness/Finance",pts:20,type:"buzzer",q:"Legally, the holders of common stock are in what position with the issuing corporation?",a:"Ownership"},
    {cat:"Agribusiness/Finance",pts:25,type:"buzzer",q:"A put option on SAEA Corp. has exercise price $45, costs $1, and stock is at $50. What is the intrinsic value?",a:"$0 (exercising would mean selling at $45 when stock is worth $50)"},
    {cat:"Resource/Policy",pts:5,type:"buzzer",q:"What term refers to removing government controls over setting prices and quantities in certain industries?",a:"Deregulation"},
    {cat:"Resource/Policy",pts:10,type:"buzzer",q:"In a supply/demand diagram, when the price is P2, what geometric area represents producer surplus?",a:"The area above the supply curve and below the price, up to quantity sold"},
    {cat:"Resource/Policy",pts:15,type:"buzzer",q:"Compared to a command system, economists typically favor a competitive market system because it promotes what?",a:"Efficiency"},
    {cat:"Resource/Policy",pts:20,type:"buzzer",q:"If a tax is placed on perfectly competitive firms that impose external costs, the firm's MC curve shifts _____ and industry supply shifts _____.",a:"Up; left"},
    {cat:"Resource/Policy",pts:25,type:"buzzer",q:"Bill plays saxophone and imposes costs on his wife. If he doesn't consider these costs and his private MB=MC at 7 hours, how long will he play?",a:"7 hours per day"},
    {cat:"Quantitative",pts:5,type:"buzzer",q:"If you can earn $10/hour working, what is the opportunity cost of one hour of leisure?",a:"$10"},
    {cat:"Quantitative",pts:10,type:"mc",q:"A variable used to incorporate qualitative information in a regression model is called a _______ variable.",a:"D",options:["Dependent","Continuous","Binomial","Dummy"]},
    {cat:"Quantitative",pts:15,type:"buzzer",q:"Price and total revenue are directly related when demand is what?",a:"Inelastic"},
    {cat:"Quantitative",pts:20,type:"buzzer",q:"If a region has a 0.1 probability of being hit by a hurricane in any year, what is the expected number in 90 years?",a:"9"},
    {cat:"Quantitative",pts:25,type:"buzzer",q:"Data on birth rate, death rate, and population growth in developing countries over 10 years is an example of what type of data?",a:"Panel data"},
    {cat:"Marketing",pts:5,type:"buzzer",q:"The whole set of beliefs, attitudes, and ways of doing things of a reasonably homogeneous set of people is called a what?",a:"Culture"},
    {cat:"Marketing",pts:10,type:"buzzer",q:"What is defined as a set of individual products that are closely related?",a:"Product line"},
    {cat:"Marketing",pts:15,type:"buzzer",q:"Industry profits tend to decline near the end of which stage of the product life cycle?",a:"Growth"},
    {cat:"Marketing",pts:20,type:"buzzer",q:"What is the process of setting a low initial price to attract a large number of buyers and cover a large market share?",a:"Market penetration pricing"},
    {cat:"Marketing",pts:25,type:"mc",q:"According to the FTC, a product can be considered 'new' for how long?",a:"C",options:["One year","Two years","Six months","One month"]},
    {cat:"Management",pts:5,type:"buzzer",q:"At what level of an organization does a corporate manager operate?",a:"Top level"},
    {cat:"Management",pts:10,type:"buzzer",q:"Guiding and supervising subordinates towards attainment of organizational goals describes which management function?",a:"Directing"},
    {cat:"Management",pts:15,type:"buzzer",q:"What is the standard of excellence against which to measure and compare?",a:"Benchmark"},
    {cat:"Management",pts:20,type:"mc",q:"Improving quality through small, incremental improvements characterizes what management system?",a:"D",options:["Just-in-time","Six Sigma","Total quality management","Kaizen"]},
    {cat:"Management",pts:25,type:"buzzer",q:"What is an increased commitment to a previous decision despite evidence that it may have been wrong?",a:"Escalation of commitment"},
    {cat:"Potpourri",pts:5,type:"buzzer",q:"What is money without inherent value made legal tender by government decree called?",a:"Fiat money"},
    {cat:"Potpourri",pts:10,type:"buzzer",q:"When sellers set prices after talking to competitors and engaging in collusion, what are they involved in?",a:"Price-fixing"},
    {cat:"Potpourri",pts:15,type:"buzzer",q:"The field of Family and Consumer Sciences was originally known by what name?",a:"Home Economics"},
    {cat:"Potpourri",pts:20,type:"buzzer",q:"What fruit is sometimes called the Chinese gooseberry?",a:"Kiwi (kiwifruit)"},
    {cat:"Potpourri",pts:25,type:"buzzer",q:"Thorstein Veblen coined what two-word term for behavior where people acquire expensive objects to display relative wealth?",a:"Conspicuous consumption"},
  ]},
  { name: "Round 4", questions: [
    {cat:"Microeconomics",pts:5,type:"buzzer",q:"Suppose you face a budget line with income of $60. If a book costs $10 and coffee costs $5, your opportunity cost of a book is how many coffees?",a:"2"},
    {cat:"Microeconomics",pts:10,type:"buzzer",q:"If a demand curve passes through (0, 6000) and (60, 0), what is the inverse demand equation?",a:"P = 6000 - 100Q"},
    {cat:"Microeconomics",pts:15,type:"mc",q:"If the income effect is opposite to the substitution effect but the substitution effect dominates, the good is:",a:"C",options:["Normal","Giffen","Inferior but not Giffen","Not enough information"]},
    {cat:"Microeconomics",pts:20,type:"buzzer",q:"If a firm produces 10 units, price is $25 per unit, and ATC at 10 units is $20, what are economic profits?",a:"$50"},
    {cat:"Microeconomics",pts:25,type:"mc",q:"When a consumer faces two goods that are perfect complements, the production function is classified as:",a:"B",options:["Cobb-Douglas","Leontief","Translog","Constant elasticity of production"]},
    {cat:"Macroeconomics",pts:5,type:"buzzer",q:"If you have just finished school and are searching for your first job, you are considered to be what type of unemployed?",a:"Frictionally unemployed"},
    {cat:"Macroeconomics",pts:10,type:"mc",q:"An increase in household wealth would cause the consumption schedule to:",a:"B",options:["Move along the same curve","Shift upward","Shift downward","Become steeper"]},
    {cat:"Macroeconomics",pts:15,type:"buzzer",q:"Cost-push inflation is best illustrated by a shift of which curve in which direction?",a:"Aggregate supply shifting left (AS0 to AS1)"},
    {cat:"Macroeconomics",pts:20,type:"mc",q:"According to Okun's Law, a 2% increase in GDP will correspond to what change in unemployment?",a:"C",options:["4% decrease","4% increase","1% decrease","1% increase"]},
    {cat:"Macroeconomics",pts:25,type:"buzzer",q:"If the MPC is 0.6, how far right would a $100 billion lump-sum tax cut shift the AD curve?",a:"$150 billion (tax cut × MPC × multiplier = $60B × 2.5)"},
    {cat:"Agribusiness/Finance",pts:5,type:"buzzer",q:"What term describes the amount of time taken for a capital budgeting project to recover its initial investment?",a:"Payback period"},
    {cat:"Agribusiness/Finance",pts:10,type:"fill",q:"The possibility that a bond issuer will not pay back the investor in a timely manner is the essence of ________ risk.",a:"default"},
    {cat:"Agribusiness/Finance",pts:15,type:"mc",q:"Which of the following is considered a liquidity ratio?",a:"A",options:["Current assets / current liabilities","Debt / net worth","Debt / total assets","Sales / total assets"]},
    {cat:"Agribusiness/Finance",pts:20,type:"buzzer",q:"When a bank makes a wide variety of loans to various borrowers, it is hoping to benefit from what?",a:"Diversification"},
    {cat:"Agribusiness/Finance",pts:25,type:"mc",q:"The key feature of the market where securities of up to one year maturity are traded is the ________ market.",a:"D",options:["Primary","Secondary","Capital","Money"]},
    {cat:"Resource/Policy",pts:5,type:"buzzer",q:"What term refers to the exhaustion of resources that are collectively owned?",a:"Tragedy of the Commons"},
    {cat:"Resource/Policy",pts:10,type:"buzzer",q:"What barrier to entry is an exclusive right granted to the author or composer of a literary, musical, or artistic work?",a:"Copyright"},
    {cat:"Resource/Policy",pts:15,type:"buzzer",q:"If the government imposes a price ceiling of $1.00 in a gasoline market where equilibrium is higher, and quantity demanded exceeds supply by 6 billion gallons, what results?",a:"A shortage of 6 billion gallons"},
    {cat:"Resource/Policy",pts:20,type:"fill",q:"If the government taxes a steel company by an amount equal to the damages of each marginal ton, the company's MC curve equals the marginal ________ cost curve.",a:"social"},
    {cat:"Resource/Policy",pts:25,type:"buzzer",q:"For a public good, how do you derive the market demand curve from individual demand curves?",a:"Vertical summation of individual demand curves"},
    {cat:"Quantitative",pts:5,type:"buzzer",q:"Forecasts that are based only on past values of the variable are referred to as what?",a:"Naïve forecasts"},
    {cat:"Quantitative",pts:10,type:"buzzer",q:"If consumer income declines, demand for what type of goods will increase?",a:"Inferior goods"},
    {cat:"Quantitative",pts:15,type:"buzzer",q:"If quantity demanded of peanut butter increases by 4% when the price of jelly decreases by 2%, what is the cross-price elasticity?",a:"-2"},
    {cat:"Quantitative",pts:20,type:"buzzer",q:"A perfectly competitive firm produces 50 units at market price $23 with ATC of $20. What is total cost?",a:"$1,000 (but actually $1,150 with $150 fixed costs)"},
    {cat:"Quantitative",pts:25,type:"buzzer",q:"The inflection point on a total cost curve is where what cost is at a minimum?",a:"Marginal cost"},
    {cat:"Marketing",pts:5,type:"fill",q:"Your firm localizes products to meet local market demands. A good approach would be __________ segmentation.",a:"geographic"},
    {cat:"Marketing",pts:10,type:"buzzer",q:"What is any paid form of non-personal presentation of ideas, goods, or services by an identified sponsor?",a:"Advertising"},
    {cat:"Marketing",pts:15,type:"buzzer",q:"What are the controllable variables a company puts together to satisfy a target group called?",a:"Marketing mix"},
    {cat:"Marketing",pts:20,type:"mc",q:"Which mode of transportation has the slowest delivery speed?",a:"C",options:["Truck","Rail","Water","Pipeline"]},
    {cat:"Marketing",pts:25,type:"buzzer",q:"What is a manager who helps direct the activities of a whole channel and tries to avoid or solve channel conflicts?",a:"Channel captain"},
    {cat:"Management",pts:5,type:"mc",q:"Lower-level managers typically confront what type of decision making?",a:"B",options:["Nonroutine","Programmed","Unique","Unprogrammed"]},
    {cat:"Management",pts:10,type:"buzzer",q:"What is the extent to which power and authority are retained at the top called?",a:"Centralization"},
    {cat:"Management",pts:15,type:"buzzer",q:"Managers with titles such as regional manager, project leader, or plant manager are what level of managers?",a:"Middle managers"},
    {cat:"Management",pts:20,type:"buzzer",q:"The abilities, values, personality traits, and characteristics that lead to superior performance are called what?",a:"Competencies"},
    {cat:"Management",pts:25,type:"mc",q:"A manager who desires to minimize maximum 'regret' will opt for what choice?",a:"C",options:["Minimum","Maximax","Minimax","Maximin"]},
    {cat:"Potpourri",pts:5,type:"buzzer",q:"What French term describes a perfect market economy with minimal government interference?",a:"Laissez-faire"},
    {cat:"Potpourri",pts:10,type:"buzzer",q:"What is generally considered the poorest country in the western hemisphere?",a:"Haiti"},
    {cat:"Potpourri",pts:15,type:"buzzer",q:"What are the three fundamental factors of production?",a:"Land, labor, and capital"},
    {cat:"Potpourri",pts:20,type:"mc",q:"Net domestic product (NDP) is GDP minus what?",a:"D",options:["Transfer payments","Indirect taxes","Subsidies","Depreciation"]},
    {cat:"Potpourri",pts:25,type:"buzzer",q:"What are monies sent by a migrant worker to family in their home country known as?",a:"Remittances"},
  ]},
];

// Flatten all mock questions for reference
const ALL_MOCK_QS = MOCK_ROUNDS.flatMap(r => r.questions);

const catColors = {
  "Microeconomics":"#eab308","Macroeconomics":"#3b82f6","Agribusiness/Finance":"#10b981",
  "Resource/Policy":"#a855f7","Quantitative":"#ef4444","Marketing":"#ec4899",
  "Management":"#06b6d4","Potpourri":"#f97316",
};

// ─── STORAGE ─────────────────────────────────────────────────────────
async function load(key, fb) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fb; }
  catch { return fb; }
}
async function save(key, d) {
  try { await window.storage.set(key, JSON.stringify(d)); } catch(e) { console.error(e); }
}

// ─── APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("mock");
  const [players, setPlayers] = useState(["Player 1","Player 2","Player 3","Player 4","Player 5","Player 6","Player 7","Player 8"]);
  const [trainingQs, setTrainingQs] = useState([]);
  const [history, setHistory] = useState([]);
  const [flashProgress, setFlashProgress] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, t, h, f] = await Promise.all([
        load("qbt-players", players),
        load("qbt-training", []),
        load("qbt-history", []),
        load("qbt-flash", {}),
      ]);
      setPlayers(p); setTrainingQs(t); setHistory(h); setFlashProgress(f);
      setReady(true);
    })();
  }, []);

  useEffect(() => { if(ready) save("qbt-players", players); }, [players, ready]);
  useEffect(() => { if(ready) save("qbt-training", trainingQs); }, [trainingQs, ready]);
  useEffect(() => { if(ready) save("qbt-history", history); }, [history, ready]);
  useEffect(() => { if(ready) save("qbt-flash", flashProgress); }, [flashProgress, ready]);

  const addHistory = (e) => setHistory(p => [...p, {...e, ts: Date.now()}]);
  const addTrainingQ = (q) => setTrainingQs(p => [...p, {...q, id: `t${Date.now()}_${Math.random().toString(36).slice(2,5)}`}]);

  const tabs = [
    {id:"mock",label:"Mock Rounds",icon:"🏆"},
    {id:"train",label:"Training",icon:"⚡"},
    {id:"flash",label:"Flashcards",icon:"🃏"},
    {id:"builder",label:"Builder",icon:"✏️"},
    {id:"team",label:"Team",icon:"👥"},
  ];

  if (!ready) return (
    <div style={{background:"#060a12",color:"#e2e8f0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif"}}>
      <p style={{opacity:0.5}}>Loading...</p>
    </div>
  );

  return (
    <div style={{background:"#060a12",color:"#e2e8f0",minHeight:"100vh",fontFamily:"'Outfit',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flipReveal{from{transform:rotateX(90deg);opacity:0}to{transform:rotateX(0);opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #eab30833}50%{box-shadow:0 0 40px #eab30866}}
        .fu{animation:fadeUp .35s ease-out both}
        .fr{animation:flipReveal .4s ease-out both}
        button{cursor:pointer;border:none;font-family:inherit;transition:all .15s}
        button:active{transform:scale(.97)}
        input,select,textarea{font-family:inherit}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#060a12}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
      `}</style>

      {/* Header */}
      <header style={{padding:"16px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>🏆</span>
          <div>
            <h1 style={{fontSize:18,fontWeight:800,color:"#eab308",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.5px"}}>QUIZ BOWL TRAINER</h1>
            <p style={{fontSize:11,color:"#64748b",fontFamily:"'JetBrains Mono',monospace"}}>
              {MOCK_ROUNDS.length} rounds locked · {trainingQs.length} training Qs · July 2026
            </p>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div style={{padding:"12px 20px 0",overflowX:"auto",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex",gap:3,background:"#0f1629",borderRadius:10,padding:3}}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:tab===t.id?700:400,
              background:tab===t.id?"#eab308":"transparent",
              color:tab===t.id?"#060a12":"#64748b",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <main style={{padding:"16px 20px 40px",maxWidth:960,margin:"0 auto"}}>
        {tab==="mock" && <MockRoundMode players={players} addHistory={addHistory}/>}
        {tab==="train" && <TrainingMode questions={trainingQs} players={players} addHistory={addHistory}/>}
        {tab==="flash" && <FlashMode questions={trainingQs} progress={flashProgress} setProgress={setFlashProgress}/>}
        {tab==="builder" && <BuilderMode addQuestion={addTrainingQ} trainingQs={trainingQs} setTrainingQs={setTrainingQs}/>}
        {tab==="team" && <TeamMode players={players} setPlayers={setPlayers} history={history}/>}
      </main>
    </div>
  );
}

// ─── SHARED: QUESTION PLAY COMPONENT ────────────────────────────────
function PlayQuestion({ q, players, onNext, onScore, scores, isLast }) {
  const [showA, setShowA] = useState(false);
  const [awarded, setAwarded] = useState(false);
  const [timer, setTimer] = useState(15);
  const [active, setActive] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    setShowA(false); setAwarded(false); setTimer(15); setActive(true);
  }, [q]);

  useEffect(() => {
    if (active && timer > 0) {
      ref.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (active && timer === 0) {
      setActive(false); setShowA(true);
    }
    return () => clearTimeout(ref.current);
  }, [timer, active]);

  const buzz = () => { setActive(false); setShowA(true); };
  const award = (p) => { if(!awarded){onScore(p, q.pts); setAwarded(true);} };

  const answerText = q.type==="mc" && q.options
    ? `${q.a}. ${q.options[["A","B","C","D","E"].indexOf(q.a)] || q.a}`
    : q.a;

  return (
    <div className="fu">
      {/* Timer + progress */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{flex:1,height:3,background:"#1e293b",borderRadius:2}}>
          <div style={{width:`${(timer/15)*100}%`,height:"100%",background:timer<=5?"#ef4444":"#eab308",borderRadius:2,transition:"width 1s linear"}}/>
        </div>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:timer<=5?"#ef4444":"#eab308",minWidth:32,textAlign:"right"}}>{timer}s</span>
      </div>

      {/* Question card */}
      <div style={{background:"#0f1629",borderRadius:14,padding:24,border:"1px solid #1e293b",marginBottom:16}}>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <span style={{background:catColors[q.cat]+"20",color:catColors[q.cat],padding:"3px 10px",borderRadius:16,fontSize:11,fontWeight:700,border:`1px solid ${catColors[q.cat]}33`}}>{q.cat}</span>
          <span style={{background:"#eab30820",color:"#eab308",padding:"3px 8px",borderRadius:16,fontSize:11,fontWeight:700}}>{q.pts} pts</span>
          <span style={{background:"#1e293b",color:"#64748b",padding:"3px 8px",borderRadius:16,fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{q.type==="mc"?"MC":q.type==="fill"?"Fill":"Buzzer"}</span>
        </div>
        <p style={{fontSize:17,lineHeight:1.55,fontWeight:500,marginBottom:16}}>{q.q}</p>

        {/* MC options before reveal */}
        {q.type==="mc" && q.options && !showA && (
          <div style={{display:"grid",gap:6,marginBottom:14}}>
            {q.options.map((o,i) => (
              <div key={i} style={{padding:"10px 14px",borderRadius:8,fontSize:13,background:"#1e293b",border:"1px solid #2d3a50",color:"#cbd5e1"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,marginRight:6}}>{["A","B","C","D","E"][i]}.</span>{o}
              </div>
            ))}
          </div>
        )}

        {!showA && (
          <button onClick={buzz} style={{
            background:"linear-gradient(135deg,#ef4444,#b91c1c)",
            color:"white",padding:"14px 36px",borderRadius:12,fontSize:17,fontWeight:800,
            fontFamily:"'JetBrains Mono',monospace",letterSpacing:"1px",display:"block",margin:"0 auto",
            boxShadow: timer<=5 ? "0 0 30px #ef444466" : "none",
          }}>🔔 BUZZ</button>
        )}

        {showA && (
          <div className="fr" style={{background:"#10b98118",border:"2px solid #10b981",borderRadius:10,padding:16}}>
            <p style={{fontSize:11,fontWeight:700,color:"#10b981",fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>ANSWER</p>
            <p style={{fontSize:17,fontWeight:700}}>{answerText}</p>
          </div>
        )}
      </div>

      {/* Scoring */}
      {showA && (
        <div className="fu" style={{animationDelay:".1s"}}>
          <p style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>
            {awarded ? "✓ AWARDED" : `TAP PLAYER TO AWARD ${q.pts} PTS`}
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:6,marginBottom:14}}>
            {players.map(p => (
              <button key={p} onClick={()=>award(p)} disabled={awarded} style={{
                padding:"8px 10px",borderRadius:8,fontSize:12,fontWeight:600,
                background:awarded?"#0f1629":"#1e293b",border:"1px solid #2d3a50",color:"#e2e8f0",
                opacity:awarded?.4:1,
              }}>{p} <span style={{color:"#eab308",fontFamily:"'JetBrains Mono',monospace",marginLeft:3}}>{scores[p]||0}</span></button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onNext} style={{flex:1,background:"#eab308",color:"#060a12",padding:"11px",borderRadius:8,fontSize:13,fontWeight:700}}>
              {isLast ? "See Results" : "Next →"}
            </button>
            {!awarded && <button onClick={onNext} style={{padding:"11px 16px",borderRadius:8,fontSize:12,background:"#1e293b",color:"#64748b",border:"1px solid #2d3a50"}}>Skip</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULTS COMPONENT ──────────────────────────────────────────────
function Results({ scores, onBack, title }) {
  const sorted = Object.entries(scores).filter(([,s])=>s>0).sort((a,b)=>b[1]-a[1]);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div className="fu" style={{textAlign:"center",maxWidth:440,margin:"0 auto"}}>
      <div style={{fontSize:52,marginBottom:6}}>🏆</div>
      <h2 style={{fontSize:20,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:"#eab308",marginBottom:6}}>{title || "RESULTS"}</h2>
      {sorted.length === 0 && <p style={{color:"#64748b",margin:"20px 0"}}>No points were awarded this round.</p>}
      {sorted.map(([name, score], i) => (
        <div key={name} className="fu" style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"10px 16px",marginBottom:6,borderRadius:8,
          background:i===0?"#eab30812":"#0f1629",border:`1px solid ${i===0?"#eab30844":"#1e293b"}`,
          animationDelay:`${i*.06}s`,
        }}>
          <span style={{fontWeight:700,fontSize:14}}>{medals[i]||`#${i+1}`} {name}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:i===0?"#eab308":"#e2e8f0"}}>{score}</span>
        </div>
      ))}
      <button onClick={onBack} style={{marginTop:20,background:"#1e293b",color:"#e2e8f0",padding:"10px 28px",borderRadius:8,fontSize:13,fontWeight:600,border:"1px solid #2d3a50"}}>Back</button>
    </div>
  );
}

// ─── MOCK ROUND MODE ─────────────────────────────────────────────────
function MockRoundMode({ players, addHistory }) {
  const [phase, setPhase] = useState("select"); // select | board | play | results
  const [round, setRound] = useState(null);
  const [scores, setScores] = useState({});
  const [used, setUsed] = useState(new Set());
  const [curQ, setCurQ] = useState(null);

  const startRound = (r) => {
    setRound(r);
    setScores(Object.fromEntries(players.map(p=>[p,0])));
    setUsed(new Set());
    setCurQ(null);
    setPhase("board");
  };

  const selectQ = (q, idx) => {
    if (used.has(idx)) return;
    setCurQ({...q, idx});
    setPhase("play");
  };

  const onScore = (player, pts) => {
    setScores(prev => ({...prev, [player]: (prev[player]||0) + pts}));
    addHistory({ player, cat: curQ.cat, pts, correct: true, mode: "mock" });
  };

  const onNext = () => {
    setUsed(prev => new Set([...prev, curQ.idx]));
    if (used.size + 1 >= round.questions.length) {
      setPhase("results");
    } else {
      setPhase("board");
      setCurQ(null);
    }
  };

  if (phase === "select") return (
    <div className="fu">
      <h2 style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>🏆 Mock Competition Rounds</h2>
      <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>These are your real competition questions. Use for periodic mock events only — don't let the team drill these!</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {MOCK_ROUNDS.map((r, i) => (
          <button key={i} onClick={()=>startRound(r)} style={{
            background:"#0f1629",border:"1px solid #1e293b",borderRadius:10,padding:18,textAlign:"left",color:"#e2e8f0",
          }}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{r.name}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{r.questions.length} questions · 8 categories</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === "results") return <Results scores={scores} title={`${round.name} Results`} onBack={()=>setPhase("select")}/>;

  if (phase === "play" && curQ) return (
    <div>
      <button onClick={()=>setPhase("board")} style={{fontSize:12,color:"#64748b",background:"none",marginBottom:10}}>← Back to board</button>
      <PlayQuestion q={curQ} players={players} onNext={onNext} onScore={onScore} scores={scores} isLast={used.size+1>=round.questions.length}/>
    </div>
  );

  // BOARD view - game show style
  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:"#eab308"}}>{round.name}</h2>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {players.map(p => (
            <span key={p} style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#94a3b8"}}>
              {p}: <span style={{color:"#eab308",fontWeight:700}}>{scores[p]||0}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:4,minWidth:600}}>
          <thead>
            <tr>
              {CATEGORIES.map(c => (
                <th key={c} style={{fontSize:10,fontWeight:700,color:catColors[c],padding:"6px 4px",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{c.slice(0,6)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {POINT_VALUES.map(pts => (
              <tr key={pts}>
                {CATEGORIES.map(cat => {
                  const idx = round.questions.findIndex(q => q.cat===cat && q.pts===pts);
                  const done = used.has(idx);
                  return (
                    <td key={cat} style={{textAlign:"center",padding:2}}>
                      <button onClick={()=>idx>=0 && !done && selectQ(round.questions[idx], idx)} disabled={done || idx<0} style={{
                        width:"100%",padding:"14px 4px",borderRadius:8,fontSize:16,fontWeight:800,
                        fontFamily:"'JetBrains Mono',monospace",
                        background:done?"#0a0e1a":idx<0?"#0a0e1a":"#0f1629",
                        color:done?"#1e293b":idx<0?"#1e293b":"#eab308",
                        border:`1px solid ${done?"#0f1629":"#1e293b"}`,
                        opacity:done?.3:1,
                      }}>{done?"✓":`$${pts}`}</button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={()=>setPhase("results")} style={{marginTop:14,fontSize:12,color:"#64748b",background:"#0f1629",padding:"8px 16px",borderRadius:6,border:"1px solid #1e293b"}}>End Round Early</button>
    </div>
  );
}

// ─── TRAINING MODE ───────────────────────────────────────────────────
function TrainingMode({ questions, players, addHistory }) {
  const [phase, setPhase] = useState("setup");
  const [config, setConfig] = useState({ cats: [...CATEGORIES], count: 10 });
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({});

  const start = () => {
    const pool = questions.filter(q => config.cats.includes(q.cat));
    const shuffled = [...pool].sort(()=>Math.random()-.5).slice(0, config.count);
    if (!shuffled.length) return;
    setDeck(shuffled); setIdx(0);
    setScores(Object.fromEntries(players.map(p=>[p,0])));
    setPhase("play");
  };

  const onScore = (p, pts) => {
    setScores(prev => ({...prev, [p]: (prev[p]||0) + pts}));
    addHistory({ player: p, cat: deck[idx].cat, pts, correct: true, mode: "train" });
  };

  const onNext = () => {
    if (idx+1 >= deck.length) { setPhase("results"); return; }
    setIdx(i=>i+1);
  };

  if (phase==="setup") return (
    <div className="fu">
      <h2 style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>⚡ Training Quiz</h2>
      <p style={{fontSize:13,color:"#64748b",marginBottom:16}}>
        AI-generated questions that test the same concepts as competition. Safe to drill daily!
        {questions.length === 0 && <span style={{color:"#eab308"}}> Go to Builder tab to generate training questions first.</span>}
      </p>
      {questions.length > 0 && <>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {CATEGORIES.map(c => {
            const n = questions.filter(q=>q.cat===c).length;
            return (
              <button key={c} onClick={()=>setConfig(p=>({...p,cats:p.cats.includes(c)?p.cats.filter(x=>x!==c):[...p.cats,c]}))} style={{
                padding:"6px 12px",borderRadius:16,fontSize:11,fontWeight:600,
                background:config.cats.includes(c)?catColors[c]+"20":"#0f1629",
                color:config.cats.includes(c)?catColors[c]:"#64748b",
                border:`1px solid ${config.cats.includes(c)?catColors[c]+"44":"#1e293b"}`,
              }}>{c} ({n})</button>
            );
          })}
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,color:"#64748b",marginRight:8}}>Questions:</label>
          <input type="number" min={1} max={50} value={config.count} onChange={e=>setConfig(p=>({...p,count:+e.target.value||10}))}
            style={{width:60,padding:"6px 8px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}/>
        </div>
        <button onClick={start} style={{background:"#eab308",color:"#060a12",padding:"12px 32px",borderRadius:8,fontSize:14,fontWeight:700}}>
          Start ({questions.filter(q=>config.cats.includes(q.cat)).length} available)
        </button>
      </>}
    </div>
  );

  if (phase==="results") return <Results scores={scores} title="Training Results" onBack={()=>setPhase("setup")}/>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:12,color:"#64748b",fontFamily:"'JetBrains Mono',monospace"}}>Q {idx+1}/{deck.length}</span>
        <button onClick={()=>setPhase("setup")} style={{fontSize:11,color:"#64748b",background:"none",textDecoration:"underline"}}>End</button>
      </div>
      <PlayQuestion q={deck[idx]} players={players} onNext={onNext} onScore={onScore} scores={scores} isLast={idx+1>=deck.length}/>
    </div>
  );
}

// ─── FLASHCARD MODE ──────────────────────────────────────────────────
function FlashMode({ questions, progress, setProgress }) {
  const [cat, setCat] = useState("All");
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [on, setOn] = useState(false);

  const start = () => {
    let pool = cat==="All" ? [...questions] : questions.filter(q=>q.cat===cat);
    pool = pool.map(q => {
      const p = progress[q.id] || {r:0,w:0,ls:0};
      const wt = 1 + p.w*2 - p.r*.5 + (Date.now()-(p.ls||0))/864e5;
      return {...q, wt: Math.max(.1, wt)};
    }).sort((a,b)=>b.wt-a.wt).slice(0, 30);
    // light shuffle
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));if(Math.random()<.3)[pool[i],pool[j]]=[pool[j],pool[i]];}
    if(!pool.length) return;
    setDeck(pool); setIdx(0); setFlipped(false); setOn(true);
  };

  const mark = (correct) => {
    const q = deck[idx];
    setProgress(prev => {
      const p = prev[q.id]||{r:0,w:0,ls:0};
      return {...prev, [q.id]: {r:p.r+(correct?1:0), w:p.w+(correct?0:1), ls:Date.now()}};
    });
    if(idx+1>=deck.length){setOn(false);return;}
    setIdx(i=>i+1); setFlipped(false);
  };

  const totalR = Object.values(progress).reduce((s,p)=>s+p.r+p.w,0);
  const totalC = Object.values(progress).reduce((s,p)=>s+p.r,0);
  const acc = totalR>0?Math.round(totalC/totalR*100):0;

  if(!on) return (
    <div className="fu">
      <h2 style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>🃏 Flashcard Drill</h2>
      <p style={{fontSize:13,color:"#64748b",marginBottom:16}}>
        Spaced repetition — missed questions return more often.
        {totalR>0 && ` ${totalR} reviews, ${acc}% accuracy.`}
        {questions.length===0 && <span style={{color:"#eab308"}}> Generate training questions in the Builder tab first!</span>}
      </p>
      {questions.length>0 && <>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
          <button onClick={()=>setCat("All")} style={{padding:"6px 12px",borderRadius:16,fontSize:11,fontWeight:600,
            background:cat==="All"?"#eab30820":"#0f1629",color:cat==="All"?"#eab308":"#64748b",border:`1px solid ${cat==="All"?"#eab30844":"#1e293b"}`}}>All ({questions.length})</button>
          {CATEGORIES.map(c=>{const n=questions.filter(q=>q.cat===c).length;return n>0?(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"6px 12px",borderRadius:16,fontSize:11,fontWeight:600,
              background:cat===c?catColors[c]+"20":"#0f1629",color:cat===c?catColors[c]:"#64748b",
              border:`1px solid ${cat===c?catColors[c]+"44":"#1e293b"}`}}>{c} ({n})</button>
          ):null;})}
        </div>
        <button onClick={start} style={{background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"white",padding:"12px 32px",borderRadius:8,fontSize:14,fontWeight:700}}>Start Drill</button>
      </>}
    </div>
  );

  const cur = deck[idx];
  const answerText = cur.type==="mc"&&cur.options?`${cur.a}. ${cur.options[["A","B","C","D","E"].indexOf(cur.a)]||cur.a}`:cur.a;

  return (
    <div className="fu" style={{maxWidth:540,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:12,color:"#64748b",fontFamily:"'JetBrains Mono',monospace"}}>{idx+1}/{deck.length}</span>
        <button onClick={()=>setOn(false)} style={{fontSize:11,color:"#64748b",background:"none",textDecoration:"underline"}}>End</button>
      </div>
      <div onClick={()=>!flipped&&setFlipped(true)} style={{
        background:flipped?"#7c3aed12":"#0f1629",border:`2px solid ${flipped?"#7c3aed":"#1e293b"}`,
        borderRadius:16,padding:32,minHeight:200,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",cursor:flipped?"default":"pointer",textAlign:"center",
        transition:"all .3s",
      }}>
        <span style={{fontSize:10,fontWeight:700,color:catColors[cur.cat],marginBottom:12}}>{cur.cat} · {cur.pts} pts</span>
        {!flipped ? (
          <>
            <p style={{fontSize:17,lineHeight:1.5,fontWeight:500,marginBottom:14}}>{cur.q}</p>
            {cur.type==="mc"&&cur.options&&<div style={{fontSize:12,color:"#64748b",textAlign:"left",width:"100%"}}>{cur.options.map((o,i)=><div key={i} style={{marginBottom:3}}>{["A","B","C","D","E"][i]}. {o}</div>)}</div>}
            <p style={{fontSize:11,color:"#475569",marginTop:12}}>Tap to reveal</p>
          </>
        ):(
          <div className="fr">
            <p style={{fontSize:11,fontWeight:700,color:"#7c3aed",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>ANSWER</p>
            <p style={{fontSize:19,fontWeight:700}}>{answerText}</p>
          </div>
        )}
      </div>
      {flipped && (
        <div className="fu" style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={()=>mark(false)} style={{flex:1,padding:"12px",borderRadius:10,fontSize:15,fontWeight:700,background:"#ef444418",color:"#ef4444",border:"1px solid #ef444433"}}>✗ Missed</button>
          <button onClick={()=>mark(true)} style={{flex:1,padding:"12px",borderRadius:10,fontSize:15,fontWeight:700,background:"#10b98118",color:"#10b981",border:"1px solid #10b98133"}}>✓ Got It</button>
        </div>
      )}
    </div>
  );
}

// ─── QUESTION BUILDER ────────────────────────────────────────────────
function BuilderMode({ addQuestion, trainingQs, setTrainingQs }) {
  const [mode, setMode] = useState("ai");
  const [aiCat, setAiCat] = useState(CATEGORIES[0]);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({cat:CATEGORIES[0],pts:10,type:"buzzer",q:"",a:"",options:["","","",""]});

  const generate = async () => {
    setLoading(true); setResults([]);
    try {
      const samples = ALL_MOCK_QS.filter(q=>q.cat===aiCat).slice(0,4).map(q=>`Q: ${q.q}\nA: ${q.a}`).join("\n\n");
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:`Generate ${aiCount} quiz bowl practice questions for category "${aiCat}". ${aiTopic?`Focus on: ${aiTopic}. `:""}

These should test the SAME CONCEPTS as the examples below but be worded DIFFERENTLY — students should not be able to memorize answers.

Example questions from this category:
${samples}

Mix types: buzzer (short answer), mc (4 options A-D), fill (fill in blank).
Vary difficulty: assign pts 5,10,15,20,25 based on difficulty.

Return ONLY a JSON array with no markdown/backticks. Each object:
{"type":"buzzer"|"mc"|"fill","q":"question","a":"answer (letter for mc)","options":["A opt","B opt","C opt","D opt"] (mc only),"pts":number}`}]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(i=>i.text||"").join("")||"";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setResults(parsed.map(q=>({...q, cat:aiCat})));
    } catch(e) {
      console.error(e);
      setResults([{error:true,msg:"Generation failed — try again."}]);
    }
    setLoading(false);
  };

  const addOne = (q) => { addQuestion(q); setResults(p=>p.filter(x=>x!==q)); };
  const addAll = () => { results.filter(q=>!q.error).forEach(q=>addQuestion(q)); setResults([]); };

  const submitManual = () => {
    if(!form.q.trim()||!form.a.trim()) return;
    const q = {cat:form.cat,pts:form.pts,type:form.type,q:form.q.trim(),a:form.a.trim()};
    if(form.type==="mc") q.options = form.options.filter(o=>o.trim());
    addQuestion(q);
    setForm(p=>({...p,q:"",a:"",options:["","","",""]}));
  };

  return (
    <div className="fu">
      <h2 style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>✏️ Question Builder</h2>
      <p style={{fontSize:13,color:"#64748b",marginBottom:14}}>
        Build your training bank. These questions are safe to drill — they test the same concepts as competition but are worded differently.
        Currently: <span style={{color:"#eab308",fontWeight:700}}>{trainingQs.length}</span> training questions.
      </p>
      <div style={{display:"flex",gap:3,background:"#0f1629",borderRadius:8,padding:3,marginBottom:20}}>
        {[{id:"ai",label:"AI Generate"},{id:"manual",label:"Manual"},{id:"browse",label:"Browse"}].map(t=>(
          <button key={t.id} onClick={()=>setMode(t.id)} style={{
            padding:"7px 14px",borderRadius:6,fontSize:12,fontWeight:mode===t.id?700:400,
            background:mode===t.id?"#eab308":"transparent",color:mode===t.id?"#060a12":"#64748b",
          }}>{t.label}</button>
        ))}
      </div>

      {mode==="ai" && (
        <div style={{maxWidth:540}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:3}}>Category</label>
              <select value={aiCat} onChange={e=>setAiCat(e.target.value)} style={{width:"100%",padding:"7px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:3}}>Count</label>
              <select value={aiCount} onChange={e=>setAiCount(+e.target.value)} style={{width:"100%",padding:"7px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}>
                {[3,5,10].map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="Optional focus (e.g. 'elasticity', 'pricing strategies')"
            style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:13,marginBottom:12}}/>
          <button onClick={generate} disabled={loading} style={{
            background:"linear-gradient(135deg,#7c3aed,#5b21b6)",color:"white",padding:"11px 28px",borderRadius:8,fontSize:13,fontWeight:700,opacity:loading?.6:1,
          }}>{loading?"Generating...":"Generate Questions"}</button>

          {results.length>0 && (
            <div style={{marginTop:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:"#eab308"}}>Generated</span>
                <button onClick={addAll} style={{fontSize:11,color:"#10b981",background:"none",textDecoration:"underline"}}>Add all to bank</button>
              </div>
              {results.map((q,i)=>q.error?(
                <p key={i} style={{color:"#ef4444",fontSize:12}}>{q.msg}</p>
              ):(
                <div key={i} className="fu" style={{background:"#0f1629",border:"1px solid #1e293b",borderRadius:8,padding:14,marginBottom:6,animationDelay:`${i*.04}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                    <div style={{flex:1}}>
                      <span style={{fontSize:10,color:catColors[q.cat],fontWeight:700}}>{q.type?.toUpperCase()} · {q.pts}pts</span>
                      <p style={{fontSize:13,margin:"3px 0"}}>{q.q}</p>
                      {q.type==="mc"&&q.options&&<p style={{fontSize:11,color:"#64748b"}}>{q.options.map((o,j)=>`${["A","B","C","D"][j]}. ${o}`).join(" | ")}</p>}
                      <p style={{fontSize:12,color:"#10b981",marginTop:3}}>A: {q.a}</p>
                    </div>
                    <button onClick={()=>addOne(q)} style={{background:"#10b98118",color:"#10b981",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700,border:"1px solid #10b98133",whiteSpace:"nowrap",alignSelf:"start"}}>+ Add</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode==="manual" && (
        <div style={{maxWidth:540}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={{padding:"7px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={form.pts} onChange={e=>setForm(p=>({...p,pts:+e.target.value}))} style={{padding:"7px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}>
              {[5,10,15,20,25].map(v=><option key={v} value={v}>{v} pts</option>)}
            </select>
            <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{padding:"7px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}>
              <option value="buzzer">Buzzer</option><option value="mc">MC</option><option value="fill">Fill</option>
            </select>
          </div>
          <textarea value={form.q} onChange={e=>setForm(p=>({...p,q:e.target.value}))} placeholder="Question..." rows={3}
            style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:13,marginBottom:8,resize:"vertical"}}/>
          {form.type==="mc"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
            {["A","B","C","D"].map((l,i)=><input key={l} value={form.options[i]} onChange={e=>{const o=[...form.options];o[i]=e.target.value;setForm(p=>({...p,options:o}));}} placeholder={`Option ${l}`}
              style={{padding:"7px 10px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:12}}/>)}
          </div>}
          <input value={form.a} onChange={e=>setForm(p=>({...p,a:e.target.value}))} placeholder={form.type==="mc"?"Correct letter (A/B/C/D)":"Answer"} onKeyDown={e=>e.key==="Enter"&&submitManual()}
            style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:13,marginBottom:10}}/>
          <button onClick={submitManual} style={{background:"#eab308",color:"#060a12",padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:700}}>Add Question</button>
        </div>
      )}

      {mode==="browse" && (
        <div>
          {trainingQs.length===0 ? <p style={{color:"#64748b",fontSize:13}}>No training questions yet. Generate some!</p> : (
            <div style={{maxHeight:500,overflowY:"auto"}}>
              {trainingQs.map((q,i)=>(
                <div key={q.id||i} style={{background:"#0f1629",border:"1px solid #1e293b",borderRadius:8,padding:12,marginBottom:4,display:"flex",gap:8}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:10,color:catColors[q.cat],fontWeight:700}}>{q.cat} · {q.pts}pts · {q.type}</span>
                    <p style={{fontSize:12,margin:"2px 0"}}>{q.q}</p>
                    <p style={{fontSize:11,color:"#10b981"}}>{q.a}</p>
                  </div>
                  <button onClick={()=>setTrainingQs(p=>p.filter((_,j)=>j!==i))} style={{fontSize:10,color:"#ef4444",background:"none",alignSelf:"start",opacity:.5}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TEAM SETUP ──────────────────────────────────────────────────────
function TeamMode({ players, setPlayers, history }) {
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [newName, setNewName] = useState("");

  const startEdit = (i) => {setEditing(i);setEditVal(players[i]);};
  const saveEdit = () => {if(editVal.trim())setPlayers(p=>p.map((x,i)=>i===editing?editVal.trim():x));setEditing(null);};
  const remove = (i) => setPlayers(p=>p.filter((_,j)=>j!==i));
  const add = () => {if(newName.trim()&&players.length<12){setPlayers(p=>[...p,newName.trim()]);setNewName("");}};

  const days = Math.ceil((new Date("2026-07-31")-new Date())/864e5);

  const getStats = (name) => {
    const e = history.filter(h=>h.player===name);
    const c = e.filter(h=>h.correct);
    return {total:e.length,correct:c.length,pts:c.reduce((s,h)=>s+(h.pts||0),0)};
  };

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono',monospace"}}>👥 Team</h2>
          <p style={{fontSize:13,color:"#64748b"}}>{players.length} players</p>
        </div>
        <div style={{background:"#eab30810",border:"1px solid #eab30833",borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:"#eab308"}}>{days}</div>
          <div style={{fontSize:10,color:"#64748b"}}>days to competition</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8,marginBottom:16}}>
        {players.map((p,i) => {
          const s = getStats(p);
          return (
            <div key={i} style={{background:"#0f1629",border:"1px solid #1e293b",borderRadius:10,padding:14}}>
              {editing===i ? (
                <div style={{display:"flex",gap:6}}>
                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus onKeyDown={e=>e.key==="Enter"&&saveEdit()}
                    style={{flex:1,padding:"5px 8px",borderRadius:6,border:"1px solid #1e293b",background:"#1e293b",color:"#e2e8f0",fontSize:13}}/>
                  <button onClick={saveEdit} style={{fontSize:11,color:"#10b981",background:"none"}}>Save</button>
                </div>
              ):(
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:700}}>{p}</span>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>startEdit(i)} style={{fontSize:10,color:"#64748b",background:"none"}}>edit</button>
                    {players.length>1&&<button onClick={()=>remove(i)} style={{fontSize:10,color:"#ef4444",background:"none"}}>×</button>}
                  </div>
                </div>
              )}
              {s.total>0 ? (
                <div style={{fontSize:11,color:"#64748b"}}>
                  <span style={{color:"#10b981"}}>{s.correct}/{s.total}</span> correct · <span style={{color:"#eab308"}}>{s.pts} pts</span>
                </div>
              ) : <p style={{fontSize:11,color:"#475569"}}>No history yet</p>}
            </div>
          );
        })}
      </div>

      {players.length<12 && (
        <div style={{display:"flex",gap:6}}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Add player..." onKeyDown={e=>e.key==="Enter"&&add()}
            style={{flex:1,maxWidth:240,padding:"8px 12px",borderRadius:6,border:"1px solid #1e293b",background:"#0f1629",color:"#e2e8f0",fontSize:13}}/>
          <button onClick={add} style={{background:"#eab308",color:"#060a12",padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:700}}>Add</button>
        </div>
      )}
    </div>
  );
}
