"use client";

import OrdersStatusPanelUI from "../../components/Section/OrdersStatusPanel";
import useOrdersStatus from "../../components/Section/useOrdersStatus";

export default function OrdersPage() {
  const ordersState = useOrdersStatus();

  return (
    <OrdersStatusPanelUI
      orders={ordersState.orders}
      selected={ordersState.selected}
      bulkStatus={ordersState.bulkStatus}
      setBulkStatus={ordersState.setBulkStatus}
      loading={ordersState.loading}
      allowedTransitions={ordersState.allowedTransitions}
      rowStatus={ordersState.rowStatus}
      toggleSelect={ordersState.toggleSelect}
      toggleSelectAll={ordersState.toggleSelectAll}
      updateStatus={ordersState.updateStatus}
      handleRowStatusChange={ordersState.handleRowStatusChange}
      getBulkOptions={ordersState.getBulkOptions}
    />
  );
}