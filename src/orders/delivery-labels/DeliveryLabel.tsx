import { OrderViewModel } from ":pages/delivery-labels";
import mytiLogo from '../../../public/myti-logo-delivery-labels.png';
import Image from 'next/image'

const labelIds = {
  label: (o: { orderId: number }) => `delivery-label-order-${o.orderId}`
}

// TODO(benglass): address shoudl be required then remove null checks
// Padding on these is tweaked so they fit on a 8.5x11 sheet with a middle perf
// There is a horizontal cut in the sheets that divides it horizontally into
// 2 regions, top and bottom, these currently line up so 2 labels on top and 2 on bottom
export function DeliveryLabel({ order }: { order: OrderViewModel }) {
  const { shippingAddress: address } = order;
  return (
      <div aria-labelledby={labelIds.label(order)} className="flex items-center mb-20">
        <div className="w-40 mr-6">
          <Image src={mytiLogo} alt="Myti: Local is Mighty" />
        </div>
        <div>
          <h2
            className="text-2xl text-teal-900 font-bold mb-2"
            id={labelIds.label(order)}
          >
            Order {order.orderNumber}
          </h2>
          {address &&
            <p>
              {address.firstName} {address.lastName}<br />
              {address.address1}{address.address2 ? ', ' + address.address2 : ''},<br />
              {address.city}, {address.state} {address.zip}
            </p>
          }
          <p className="mt-3">
            <strong className="font-bold uppercase">Delivered By:</strong>
          </p>
        </div>
      </div>
  );
}
