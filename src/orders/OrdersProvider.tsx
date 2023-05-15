import { useContext, useEffect, useState } from "react";
import { Myco } from ":api/client";
import { APIContext } from ":pages/_app";

type OrdersLoadingState = {
  status: 'idle' | 'loading';
}

type OrdersLoadedState = {
  status: 'loaded';
  orders: Myco.Order[];
  shops: Myco.Shop[];
}

export type OrdersState = OrdersLoadingState | OrdersLoadedState;

type OrdersProviderProps = {
  children: (state: OrdersLoadedState) => JSX.Element,
  includeStatus?: Array<Myco.Order["status"]>
}

export function OrdersProvider({ children, includeStatus = [] }: OrdersProviderProps) {
  const api = useContext(APIContext);
  const [state, setState] = useState<OrdersState>({
    status: 'idle',
  });

  useEffect(() => {
    (async () => {
      setState({ status: 'loading' });

      const result = await api.getOrders({ open: true });
      if (result.err) {
        // TODO(benglass): error handling
        console.log('error getting orders', result.val);
      } else {
        let { orders, shops } = result.val;
        // TODO(benglass): sorting needed? Should we move to api?
        shops.sort((a, b) => a.name.localeCompare(b.name))
        orders.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        orders = orders
          // TODO: Move to the api
          .filter(order => order.shippingAddress)
          .filter(order => !includeStatus.length || includeStatus.includes(order.status))
          .map(order => ({
            ...order,
            lineItems: order.lineItems
              .map(li => ({
                ...li,
                // TODO(benglass): This is a view-specific concern (what size?) but for now easiest to do here
                imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
              }))
              .sort((a, b) => a.title.localeCompare(b.title))
          }));

        setState({ status: 'loaded', orders, shops });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (state.status) {
    case 'idle':
    case 'loading':
      return <p>Loading...</p>
    case 'loaded':
      if (!state.orders.length) {
        return <p>There are no open orders.</p>
      }

      return children(state);
  }
}