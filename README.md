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