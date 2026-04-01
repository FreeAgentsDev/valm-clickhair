"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Package,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import type { Order } from "@/types";

interface OrdersViewerProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
}

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pendiente", bg: "bg-amber-100", text: "text-amber-700" },
  paid: { label: "Pagado", bg: "bg-green-100", text: "text-green-700" },
  processing: { label: "Procesando", bg: "bg-blue-100", text: "text-blue-700" },
  shipped: { label: "Enviado", bg: "bg-purple-100", text: "text-purple-700" },
  delivered: { label: "Entregado", bg: "bg-gray-100", text: "text-gray-700" },
};

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

const PAYMENT_LABELS: Record<string, string> = {
  "mercado-pago": "Mercado Pago",
  wompi: "Wompi",
  addi: "ADDI",
};

export default function OrdersViewer({
  orders,
  loading,
  error,
  onRefresh,
  onUpdateStatus,
}: OrdersViewerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filtered = orders
    .filter((o) => {
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <RefreshCw size={20} className="animate-spin mr-2" />
        Cargando órdenes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">
          Órdenes de compra
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({orders.length})
          </span>
        </h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as Order["status"] | "all")
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de órdenes */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">
            {orders.length === 0
              ? "No hay órdenes aún"
              : "No se encontraron órdenes con estos filtros"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const itemCount = order.items?.reduce(
              (sum, i) => sum + i.quantity,
              0
            ) ?? 0;

            return (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Row principal */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : order.id)
                  }
                  className="w-full text-left p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-500">
                          {order.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.bg} ${sc.text}`}
                        >
                          {sc.label}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 truncate">
                        {order.shipping?.name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)} · {itemCount} item
                        {itemCount !== 1 ? "s" : ""} ·{" "}
                        {PAYMENT_LABELS[order.paymentMethod] ||
                          order.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </button>

                {/* Detalle expandido */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4">
                    {/* Info del comprador */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500">
                          Comprador
                        </h4>
                        <div className="space-y-1.5 text-sm text-gray-700">
                          <p className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            {order.shipping?.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {order.shipping?.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            {order.shipping?.phone}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500">
                          Envío
                        </h4>
                        <div className="space-y-1.5 text-sm text-gray-700">
                          <p className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            {order.shipping?.address}
                          </p>
                          <p className="text-gray-500">
                            {order.shipping?.city},{" "}
                            {order.shipping?.department}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
                        Productos
                      </h4>
                      <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 text-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-gray-900">
                                {item.product?.name || "Producto"}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                × {item.quantity}
                              </span>
                            </div>
                            <span className="font-mono text-gray-700">
                              {formatPrice(
                                (item.product?.price || 0) * item.quantity
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totales */}
                    <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Envío</span>
                        <span>{formatPrice(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Cambiar estado */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-600">
                        Cambiar estado:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium focus:border-[#D62839] focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
