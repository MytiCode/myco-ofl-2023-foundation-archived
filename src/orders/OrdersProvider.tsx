import { useEffect, useState } from "react";
import { Myco, MycoClient } from ":api/client";

type OrdersState = {
  status: 'idle' | 'loading' | 'loaded';
  orders?: Myco.Order[];
  shops?: Myco.Shop[];
}

export function OrdersProvider({ children }: { children: (state: OrdersState) => JSX.Element }) {
  const [state, setState] = useState<OrdersState>({
    status: 'idle',
  });

  useEffect(() => {
    (async () => {
      setState({ status: 'loading' });

      // const orders = (data.orders as unknown as Order[]);
      // const shops = (data.shops as unknown as Shop[]);
      const api = new MycoClient({
        apiUrl: 'http://localhost:8888'
      });

      const result = await api.getOrders();
      if (result.err) {
        // TODO(benglass): error handling
        console.log('error getting orders', result.err);
      } else {
        const { orders, shops } = result.val;
        // TODO(benglass): sorting needed? Should we move to api?
        shops.sort((a, b) => a.name.localeCompare(b.name))
        orders.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        orders.forEach(order => {
          order.lineItems = order.lineItems
            .map(li => ({
              ...li,
              // TODO(benglass): This is a view-specific concern (what size?) but for now easiest to do here
              imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
            }))
            .sort((a, b) => a.title.localeCompare(b.title));
        })

        setState({ status: 'loaded', orders, shops });
      }
    })();
  }, []);

  return children(state);
}