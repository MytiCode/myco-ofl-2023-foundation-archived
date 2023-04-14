import Layout from ":components/Layout";
import { PickupSheet } from ":orders/pickup-sheets/PickupSheet";
import { useEffect, useState } from "react";
import { Myco, MycoClient } from ":api/client";

// const orders = (data.orders as unknown as Order[])
//   .map(order => {
//     const lineItemViewModels =
//       order.lineItems
//         .map(li => ({
//           ...li,
//           // TODO: This should be centralized? Or pushed down to image rendering
//           imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
//         }))
//         .sort((a, b) => a.title.localeCompare(b.title));

//     return {
//       ...order,
//       lineItems: lineItemViewModels,
//     };
//   })
//   // .slice(0, 10)
//   .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

function createOrdersViewModel({ orders }: { orders: Myco.Order[] }): OrderViewModel[] {
  return orders.map(order => {
    const lineItemViewModels =
      order.lineItems
        .map(li => ({
          ...li,
          // TODO: This should be centralized? Or pushed down to image rendering
          imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

    return {
      ...order,
      lineItems: lineItemViewModels,
    };
  })
  // .slice(0, 10)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

function createShopViewModels({ shops, orders }: { shops: Myco.Shop[], orders: Myco.Order[] }): ShopViewModel[] {
  const orderViewModels = createOrdersViewModel({ orders });

  return shops.map((shop): ShopViewModel => ({
    orders: orderViewModels
      .map(o => ({
        ...o,
        lineItems: o.lineItems.filter(li => li.shopId === shop.shopId)
      }))
      .filter(o => o.lineItems.length),
    ...shop,
  }))
  .filter(shop => shop.orders.length)
  .sort((a, b) => a.name.localeCompare(b.name))
}

// const shopViewModels = (data.shops as unknown as Shop[])
//   .map((shop): ShopViewModel => ({
//     orders: orders
//       .map(o => ({
//         ...o,
//         lineItems: o.lineItems.filter(li => li.shopId === shop.shopId)
//       }))
//       .filter(o => o.lineItems.length),
//     ...shop,
//   }))
//   .filter(shop => shop.orders.length)
//   .sort((a, b) => a.name.localeCompare(b.name))

// export type LineItemViewModel = LineItem & {
// }

// export type ShopViewModel = Shop & {
//   orders: OrderViewModel[];
// };

// export type OrderViewModel = Order & {
//   lineItems: LineItemViewModel[];
// }

export type LineItemViewModel = Myco.OrderLineItem & {
}

export type ShopViewModel = Myco.Shop & {
  orders: OrderViewModel[];
};

export type OrderViewModel = Myco.Order & {
  lineItems: LineItemViewModel[];
}

export default function PickupSheetsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [shops, setShops] = useState<ShopViewModel[] | null>();
  useEffect(() => {
    (async () => {
      setStatus('loading');

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
        setStatus('loaded');
        console.log('got orders/shops', { orders, shops });

        const shopViewModels = createShopViewModels({ orders, shops });
        console.log('created VMs', shopViewModels);
        setShops(shopViewModels);
      }

    })();
  }, []);
  return (
    <Layout title="Pickup Sheets">
      {status === 'loading' &&
        <p>Loading...</p>
      }
      {shops &&
        <>
          {shops.map(shop => (
            <PickupSheet key={shop.shopId} shop={shop} />
          ))}
        </>
      }
    </Layout>
  );
}
