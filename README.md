# InMeasure

OPTIMIZATIONS:

- Encode post messages and decode on server (less bytes)
- Websocket connection to post data // Send all data 100% of the time, all at once
- Authorization Setup And Less Overall DB Queries All Round;
  - Script: Authorize and creation connection with connection type;
  - Duration/Standard/Recording. Insert with ref to connection and connection type. If not match don't. (Avoid auth check every time.)
- Use more totals like tables and better columns instead of many event rows and large queries when only need the totals

TODOS:

- Finish landing page (calculator)
- Payment functional
- Payment required
- Take payment recurring

const items = [
  "Get a comprehensive overview of your website's performance with our intuitive dashboard. Track key metrics such as page views, unique visitors, bounce rates, and average session duration in real-time.",

  "Understand how visitors interact with your site. Track user journeys, analyze click patterns, and identify popular content to optimize your user experience and increase engagement.",

  "Monitor your website's activity as it happens. Spot trends, identify issues, and make quick decisions based on current user behavior.",

  "Improve your website's speed and efficiency. Our performance metrics help you identify bottlenecks, optimize load times, and enhance overall site performance for better user experience and SEO rankings.",

  "Monitor conversion goals to measure the effectiveness of your marketing efforts. Track form submissions, product purchases, or any custom events to understand your conversion funnel and improve ROI.",

  "Monitor performance, conversions, behavior, and other key indicators by device type. Ensuring an enjoyable and optimal experience for every user no matter the device.",

  "Monitor geographic information to understand where and who your audience is. Monitor performance, conversions, behavior, and other key indicators across the globe.",

  "Gather tailored information to meet your specific needs. Our flexible reporting tools allow you to track all the KPIs your organization want.",

  "Integrate analytics data into your existing workflows and tools with easy API access.",
];
