"use client"

import styles from "./page.module.css"
import Link from "next/link"
import { useState, useEffect} from 'react'
import axios from 'axios'
import https from 'https'

//Establishes a connection with the backend Node.js server
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2001',
  timeout: 10000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    'Content-Type': 'application/json',
  },
});

//Interface for each ticket and array of tickets
interface Item {
  name: string,
  price: number,
  type: string,
}
interface Ticket {
  dateCreated: string;
  orderItems: Item[];
  orderNumber: string,
  totalPayment: number,
  status: string,
}

const CurrentOrders: React.FC = () => {
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([])
  const [showTickets, setTicketBool] = useState<boolean>(false)
  const [loadingCounter, setLoading] = useState<number>(0)

  useEffect(() => {
    //Creates and executes loading element
    const interval = setInterval(() => {
      setLoading(0)
      const interval2 = setInterval(() => {
        setLoading(prev => prev + 1)
      }, 500)
      setTimeout(() => {
        clearInterval(interval2)
      }, 1500)
    }, 1500)

    setTimeout(() => {
      clearInterval(interval)
    }, 4500)

    setTimeout(() => {
      setTicketBool(true)
    }, 6500)

    //Axios function that gets all pending tickets
    async function getTickets(): Promise<void> {
      try {
        const { data: response } = await axiosInstance.get('/tickets/pendingtickets');
        const pendingDataArr: Ticket[] = await response;
          setPendingTickets(pendingDataArr);
      }
      catch (err) {
        console.log("Unable to Fetch Menu", err);
      }
    }
    getTickets();
  }, [])

  //Handles the onClick complete button by patching the current ticket with "complete" and removing it from view
  async function completeTicket(id: string): Promise<void> {
    try {
      const ticketId: object = {
        id: id,
      }

      const { data: response } = await axiosInstance.patch('/tickets/status/complete', ticketId);
      const pendingDataArr: Ticket[] = await response;
      console.log(pendingDataArr)
      setPendingTickets(pendingDataArr)
     
    }
    catch (err) {
      console.log("Unable to Fetch Menu", err);
    }
  }

  //Complete handler
  function handleComplete(id: string) {
    completeTicket(id)
  }

  return (
    <div>
      {!showTickets && <div className={styles.loading}>
        {loadingCounter === 0 && <h1>Loading...</h1>}
        {loadingCounter === 1 && <h1>Loading.</h1>}
        {loadingCounter === 2 && <h1>Loading..</h1>}
        {loadingCounter === 3 && <h1>Loading...</h1>}
      </div>}
      {showTickets &&
        <div>
          <div className={styles.ticketMenu }>
            <button><Link href="/">Menu</Link></button>
            <button><Link href="/history">History</Link></button>
          </div>
        <ul className={styles.ticketlist}>
        <div className={styles.ticket }>
          {pendingTickets.map((obj) => (
            <li className={styles.ticketcontent} key={obj.orderNumber}>
            <h1>Order: {obj.orderNumber}</h1>
              <p>{obj.dateCreated}</p>
              <button onClick={() => handleComplete(obj.orderNumber) }>Complete</button>
              <ul>
                <div className={styles.line}></div>
              {obj.orderItems.map((obj2, index) => (
                <li className={styles.items} key={index}>{obj2.name}</li>
              ))}
              </ul>
            </li>
        ))}
        </div>
        </ul>
        </div>}
    </div>
)
}

export default CurrentOrders;