
"use client";

import { clearTokens } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Users,
  UserRound,
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  customer_id: number;
  customer_name: string;
  phone: string | null;
  address: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // READ ALL CUSTOMERS
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiClient<Customer[]>(
        CONFIG.ENDPOINTS.ADDRESS,
        {
          method: "GET",
          requiresAuth: true,
        }
      );

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isChecking) {
      fetchCustomers();
    }
  }, [isChecking, fetchCustomers]);

  // READ SINGLE CUSTOMER
  const handleViewCustomer = async (customerId: number) => {
    setError("");
    setSuccess("");

    try {
      const data = await apiClient<Customer>(
        `${CONFIG.ENDPOINTS.ADDRESS}/${customerId}`,
        {
          method: "GET",
          requiresAuth: true,
        }
      );

      setSelectedCustomer(data);
    } catch (err: any) {
      setError(err.message || "Failed to load customer details.");
    }
  };

  // CREATE FORM
  const openCreateForm = () => {
    setEditingId(null);
    setCustomerName("");
    setPhone("");
    setAddress("");
    setSelectedCustomer(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  // UPDATE FORM
  const openEditForm = (customer: Customer) => {
    setEditingId(customer.customer_id);
    setCustomerName(customer.customer_name);
    setPhone(customer.phone || "");
    setAddress(customer.address || "");
    setSelectedCustomer(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setCustomerName("");
    setPhone("");
    setAddress("");
  };

  // CREATE AND UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const customerData = {
        customer_name: customerName,
        phone: phone || null,
        address: address || null,
      };

      if (editingId !== null) {
        await apiClient(
          `${CONFIG.ENDPOINTS.ADDRESS}/${editingId}`,
          {
            method: "PUT",
            requiresAuth: true,
            body: JSON.stringify(customerData),
          }
        );

        setSuccess(`Customer #${editingId} updated successfully.`);
      } else {
        await apiClient(CONFIG.ENDPOINTS.ADDRESS, {
          method: "POST",
          requiresAuth: true,
          body: JSON.stringify(customerData),
        });

        setSuccess("New customer created successfully.");
      }

      closeForm();
      await fetchCustomers();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE CUSTOMER
  const handleDelete = async (customerId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Customer #${customerId}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await apiClient(
        `${CONFIG.ENDPOINTS.ADDRESS}/${customerId}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      if (selectedCustomer?.customer_id === customerId) {
        setSelectedCustomer(null);
      }

      setSuccess(`Customer #${customerId} deleted successfully.`);
      await fetchCustomers();
    } catch (err: any) {
      setError(err.message || "Failed to delete customer.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-sm text-blue-600">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 md:p-8">

      <div className="mx-auto max-w-6xl space-y-6">

        {/* NAVBAR */}
        <header className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Users size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Laundry Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Manage your laundry customers
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

        </header>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Card className="border-blue-100 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-6">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Customers
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-700">
                  {customers.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                <Users size={28} />
              </div>

            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-6">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Dashboard Status
                </p>

                <h2 className="mt-2 text-xl font-bold text-blue-700">
                  Active
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                <UserRound size={28} />
              </div>

            </CardContent>
          </Card>

        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* CREATE / UPDATE FORM */}
        {isFormOpen && (
          <Card className="border-blue-100 bg-white shadow-md">

            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-blue-800">
                  {editingId !== null
                    ? `Update Customer #${editingId}`
                    : "Create New Customer"}
                </CardTitle>

                <CardDescription>
                  Enter the customer information below.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeForm}
                className="text-blue-600 hover:bg-blue-50"
              >
                <X size={18} />
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div className="space-y-2">
                    <Label htmlFor="customer_name">
                      Customer Name
                    </Label>

                    <Input
                      id="customer_name"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number
                    </Label>

                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">
                      Address
                    </Label>

                    <Input
                      id="address"
                      placeholder="Enter customer address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-2">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId !== null
                      ? "Save Changes"
                      : "Create Customer"}
                  </Button>

                </div>

              </form>
            </CardContent>
          </Card>
        )}

        {/* CUSTOMER DETAILS */}
        {selectedCustomer && (
          <Card className="border-blue-100 bg-white shadow-md">

            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-blue-800">
                  Customer Details
                </CardTitle>

                <CardDescription>
                  Customer #{selectedCustomer.customer_id}
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCustomer(null)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <X size={18} />
              </Button>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 text-sm md:grid-cols-3">

              <div>
                <span className="block text-slate-500">
                  Customer ID
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedCustomer.customer_id}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">
                  Customer Name
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedCustomer.customer_name}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">
                  Phone Number
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedCustomer.phone || "N/A"}
                </span>
              </div>

              <div className="md:col-span-3">
                <span className="block text-slate-500">
                  Address
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedCustomer.address || "N/A"}
                </span>
              </div>

            </CardContent>
          </Card>
        )}

        {/* CUSTOMER TABLE */}
        <Card className="overflow-hidden border-blue-100 bg-white shadow-md">

          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <CardTitle className="text-blue-800">
                Customer Management
              </CardTitle>

              <CardDescription>
                View and manage all registered customers.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <Button
                variant="outline"
                onClick={fetchCustomers}
                disabled={loading}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>

              <Button
                onClick={openCreateForm}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>

            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-blue-100">

              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow className="hover:bg-blue-50">
                    <TableHead className="font-semibold text-blue-900">
                      ID
                    </TableHead>

                    <TableHead className="font-semibold text-blue-900">
                      Customer Name
                    </TableHead>

                    <TableHead className="font-semibold text-blue-900">
                      Phone Number
                    </TableHead>

                    <TableHead className="font-semibold text-blue-900">
                      Address
                    </TableHead>

                    <TableHead className="text-right font-semibold text-blue-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-slate-500"
                      >
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-slate-500"
                      >
                        No customers found. Click Add Customer to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow
                        key={customer.customer_id}
                        className="hover:bg-blue-50/70"
                      >
                        <TableCell className="font-medium text-slate-700">
                          {customer.customer_id}
                        </TableCell>

                        <TableCell className="font-medium text-slate-800">
                          {customer.customer_name}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.phone || "-"}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.address || "-"}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewCustomer(customer.customer_id)
                              }
                              className="border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Read
                            </Button>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openEditForm(customer)}
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              Update
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDelete(customer.customer_id)
                              }
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                </TableBody>
              </Table>

            </div>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <footer className="py-4 text-center text-sm text-slate-500">
          Laundry Management System © 2026
        </footer>

      </div>
    </div>
  );
}
