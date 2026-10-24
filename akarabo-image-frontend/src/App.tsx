/**
 * Application routes.
 *
 * The router mirrors the backend's role rules: every screen that needs a
 * specific role is wrapped in `ProtectedRoute`, which sends visitors without
 * the right role back to the dashboard.
 */
import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { BookingDetails } from './pages/BookingDetails';
import { Bookings } from './pages/Bookings';
import { CustomerDetails } from './pages/CustomerDetails';
import { ClientServices } from './pages/ClientServices';
import { Customers } from './pages/Customers';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NewBooking } from './pages/NewBooking';
import { NewCustomer } from './pages/NewCustomer';
import { NewExpense } from './pages/NewExpense';
import { NewPayment } from './pages/NewPayment';
import { NewStaff } from './pages/NewStaff';
import { NotFound } from './pages/NotFound';
import { Payments } from './pages/Payments';
import { Profile } from './pages/Profile';
import { PhotographerTaskAssignment } from './pages/PhotographerTaskAssignment';
import { Staff } from './pages/Staff';
import { StudioReports } from './pages/StudioReports';
import { useAuth } from './context/AuthContext';
import type { Role } from './types/auth';

/** Roles that may look at the money. */
const FINANCE_ROLES: Role[] = ['OWNER', 'MANAGER'];

/** Roles that may administer staff accounts. */
const ADMIN_ROLES: Role[] = ['OWNER', 'MANAGER'];

interface GuardedProps {
  /** Roles allowed to open the screen. */
  roles?: Role[];
  /** The screen itself. */
  children: ReactNode;
}

/** Route wrapper that enforces the role rules of the backend. */
function Guarded({ roles = [], children }: GuardedProps) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}

function DashboardHome() {
  const { user } = useAuth();
  return user?.role === 'PHOTOGRAPHER' ? <Customers /> : <Dashboard />;
}

/** Root of the routing tree. */
export function App() {
  return (
    <Routes>
      {/* Public — the only screens reachable without a session. */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Everything else lives inside the signed-in shell. */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/reports/studio" element={<StudioReports />} />
        <Route path="/client-services" element={<Guarded roles={['OWNER', 'MANAGER', 'CASHIER']}><ClientServices /></Guarded>} />
        <Route path="/tasks/new" element={<Guarded roles={['OWNER', 'MANAGER', 'CASHIER']}><PhotographerTaskAssignment /></Guarded>} />

        <Route path="/bookings" element={<Guarded roles={['OWNER', 'MANAGER', 'CASHIER']}><Bookings /></Guarded>} />
        <Route path="/bookings/new" element={<Guarded roles={['OWNER', 'MANAGER']}><NewBooking /></Guarded>} />
        <Route path="/bookings/:id" element={<Guarded roles={['OWNER', 'MANAGER', 'CASHIER']}><BookingDetails /></Guarded>} />

        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<NewCustomer />} />
        <Route path="/customers/:id" element={<Guarded roles={['OWNER', 'MANAGER', 'CASHIER']}><CustomerDetails /></Guarded>} />

        <Route
          path="/payments"
          element={
            <Guarded roles={FINANCE_ROLES}>
              <Payments />
            </Guarded>
          }
        />
        <Route
          path="/payments/new"
          element={
            <Guarded roles={FINANCE_ROLES}>
              <NewPayment />
            </Guarded>
          }
        />

        <Route
          path="/expenses"
          element={
            <Guarded roles={FINANCE_ROLES}>
              <Expenses />
            </Guarded>
          }
        />
        <Route
          path="/expenses/new"
          element={
            <Guarded roles={FINANCE_ROLES}>
              <NewExpense />
            </Guarded>
          }
        />

        <Route
          path="/staff"
          element={
            <Guarded roles={ADMIN_ROLES}>
              <Staff />
            </Guarded>
          }
        />
        <Route
          path="/staff/new"
          element={
            <Guarded roles={ADMIN_ROLES}>
              <NewStaff />
            </Guarded>
          }
        />
        <Route
          path="/staff/:id/edit"
          element={
            <Guarded roles={ADMIN_ROLES}>
              <NewStaff />
            </Guarded>
          }
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
