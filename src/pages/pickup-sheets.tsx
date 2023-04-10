import Layout from "@/components/Layout";

export default function PickupSheetsPage() {
  return (
    <Layout title="Pickup Sheets">
      <div aria-labelledby="shop-label-1">
        <h2 id="shop-label-1">Homeport</h2>
        <p>52 Church Street, Burlington, VT 05401</p>
        <div aria-labelledby="order-label-1">
          <h3 id="order-label-1">#1234-2</h3>
          <div aria-labelledby="line-item-1">
            <h4 id="line-item-1">Drink Koozie - Boozie Bottle Neoprene</h4>
            <p>
              <span aria-label="QTY Ordered">1</span>
              <span>Line Item ID: 123456789</span>
            </p>
            <img src="https://cdn.shopify.com/s/files/1/0578/9899/1785/products/PerfumeArmy_grande__06524.1649704087.386.513.jpg?v=1653412449&width=400" alt="The Line Item" />
          </div>
        </div>
      </div>
      <p>I am the pickup sheets!</p>
    </Layout>
  );
}