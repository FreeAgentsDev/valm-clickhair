"use client";

import { useState, useMemo } from "react";
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
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import type { Order } from "@/types";

interface OrdersViewerProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => Promise<void>;
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

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function OrdersViewer({
  orders,
  loading,
  error,
  onRefresh,
  onUpdateStatus,
  onDelete,
}: OrdersViewerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Unique payment methods in orders
  const paymentMethods = useMemo(() => {
    const methods = new Set(orders.map((o) => o.paymentMethod));
    return Array.from(methods);
  }, [orders]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return orders
      .filter((o) => {
        const matchesSearch =
          !search ||
          o.id.toLowerCase().includes(searchLower) ||
          o.shipping?.name?.toLowerCase().includes(searchLower) ||
          o.shipping?.email?.toLowerCase().includes(searchLower) ||
          o.shipping?.phone?.includes(search) ||
          o.shipping?.city?.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        const matchesPayment = paymentFilter === "all" || o.paymentMethod === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "date") {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          cmp = a.total - b.total;
        }
        return sortDir === "desc" ? -cmp : cmp;
      });
  }, [orders, search, statusFilter, paymentFilter, sortField, sortDir]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset page when filters change
  const handleFilterChange = () => setPage(1);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      if (expandedId === id) setExpandedId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSort = (field: "date" | "total") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "all" || paymentFilter !== "all";

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">
          Órdenes de compra
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({orders.length} total{filtered.length !== orders.length && ` · ${filtered.length} filtradas`})
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

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por ID, nombre, email, teléfono o ciudad..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as Order["status"] | "all");
              handleFilterChange();
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              handleFilterChange();
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
          >
            <option value="all">Todos los pagos</option>
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {PAYMENT_LABELS[m] || m}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              <X size={14} />
              Limpiar
            </button>
          )}
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium">Ordenar:</span>
          <button
            onClick={() => toggleSort("date")}
            className={`rounded-md px-2.5 py-1 transition-colors ${sortField === "date" ? "bg-[#D62839]/10 text-[#D62839] font-semibold" : "hover:bg-gray-100"}`}
          >
            Fecha {sortField === "date" && (sortDir === "desc" ? "↓" : "↑")}
          </button>
          <button
            onClick={() => toggleSort("total")}
            className={`rounded-md px-2.5 py-1 transition-colors ${sortField === "total" ? "bg-[#D62839]/10 text-[#D62839] font-semibold" : "hover:bg-gray-100"}`}
          >
            Total {sortField === "total" && (sortDir === "desc" ? "↓" : "↑")}
          </button>
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">
            {orders.length === 0
              ? "No hay órdenes aún"
              : "No se encontraron órdenes con estos filtros"}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-3 text-xs font-medium text-[#D62839] hover:underline">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((order) => {
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
                            {order.id.length > 12 ? `${order.id.slice(0, 12)}...` : order.id}
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

                      {/* Actions: status + delete */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
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

                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deletingId === order.id}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {deletingId === order.id ? "Eliminando..." : "Eliminar orden"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Mostrando</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-[#D62839] focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span>
                de {filtered.length} orden{filtered.length !== 1 ? "es" : ""}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage <= 1}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Primera página"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Anterior"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-3 text-xs font-medium text-gray-700">
                {safePage} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Siguiente"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage >= totalPages}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Última página"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
