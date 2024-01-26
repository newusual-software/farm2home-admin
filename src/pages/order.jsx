import { OrderTable } from "../components/molecule/orderTable/orderTable";
import DefaultLayout from "../layouts/defaultLayout";

export default function Order() {
  return (
    <DefaultLayout>
      <div className="text-[#212323] pl-10 text-xl font-medium font-workSans my-2">
      Customers Account List
      </div>
      <>
        <OrderTable />
      </>
    </DefaultLayout>
  );
}
