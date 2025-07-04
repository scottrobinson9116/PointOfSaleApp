****************************************************************
# PointOfSaleApp
Full stack app that can track, take, and modify fast food orders
****************************************************************

----------------------------------------------------------------
Front end: Next.js & Typescript
-----------------------------------------------------------------

Page.tsx: A Menu screen that displays and creates the current order.
Menu items and prices are fetched from MongoDB and rendered by mapping them to a grid.
When "Pay" is clicked the order is posted to MongoDB and appears on the "Tickets" page.

------------------------------------------------------------------

CurrentOrders Page: A Ticket screen that displays all "pending" tickets with each order's information, including order number, date created, and food items.
Each ticket possesses a "complete" button that patches the status of the ticket to "complete". The ticket is then removed from the queue.

-------------------------------------------------------------------

History Page: This page displays every ticket entry in MongoDB thereby providing a resource to look up, refund and remake each order.
Each ticket is mapped to render the ticket number, date created, and total. When a list entry is clicked a conditionally rendered popup displays all ticket info along with the "Refund" and "Remake" buttons.
The "Refund" and "Remake" buttons patch the status of the selected ticket, which triggers rendering on the CurrentOrders page.


-------------------------------------------------------------------
Backend: Node.js, Typescript and MongoDB(mongoose)
-------------------------------------------------------------------

A Node.js server that uses routes and models to implement an API for communicating and modifying MongoDB.
The Mongoose library is used to acheive this communication
