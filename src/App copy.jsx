import React, { useMemo, useState } from "react";
import {
  Truck,
  User,
  MapPin,
  MessageCircle,
  Car,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  Phone,
  Mail,
  Map,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Filter,
  MoreVertical,
  Info,
  Star,
  Shield,
  Key,
  Navigation,
  TrendingUp,
  Package
} from "lucide-react";

// --- BOILERPLATE/HELPER COMPONENTS (Added/Completed for error prevention) ---

// Placeholder for missing components
const Header = ({ title, actions }) => (
    <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {actions}
    </div>
);
// FIX: Removed trailing semicolon after className = ""
const Section = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">{title}</h3>
        {children}
    </div>
);
const Card = ({ children, className = "", onClick }) => (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-sm p-4 border border-gray-100 ${className}`}>
        {children}
    </div>
);
const Badge = ({ children, variant = "default", className = "" }) => {
    const variantMap = {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
        secondary: "bg-purple-100 text-purple-800",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]} ${className}`}>
            {children}
        </span>
    );
};
const Button = ({ children, variant = "primary", size = "md", ...props }) => {
    const base = "inline-flex items-center justify-center border font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const sizeMap = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
    const variantMap = {
        primary: "border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
        success: "border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        error: "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline: "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
    };
    const disabled = props.disabled ? "opacity-50 cursor-not-allowed" : "";
    return (
        <button className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${disabled}`} {...props}>
            {children}
        </button>
    );
};
const Input = ({ label, type = "text", ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500" {...props} />
    </div>
);
const Select = ({ label, options, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500" {...props}>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);
const FileUpload = ({ label, onFileChange, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label || "Upload File"}</label>
        <input type="file" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" {...props} />
    </div>
);
const RatingStars = ({ rating }) => (
    <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
    </div>
);

// --- UPDATED DASHBOARD COMPONENT ---
const Dashboard = ({ stats, drivers }) => {
    const statCards = [
        { label: "Total Drivers", value: stats.totalDrivers, icon: User, variant: "primary" },
        { label: "Total Clients", value: stats.totalClients, icon: Truck, variant: "secondary" },
        { label: "Total Trucks", value: stats.totalTracks, icon: Car, variant: "default" },
        { label: "Available Trucks", value: stats.availableTracks, icon: CheckCircle, variant: "success" },
        { label: "Unavailable Trucks", value: stats.unavailableTracks, icon: AlertCircle, variant: "error" },
        { label: "Total Requests", value: stats.totalRequests, icon: FileText, variant: "warning" },
    ];
    
    const timeStatCards = [
        { label: "Requests (Last Week)", value: stats.requestsLastWeek, icon: Clock, variant: "default" },
        { label: "Requests (Last Month)", value: stats.requestsLastMonth, icon: Clock, variant: "default" },
        { label: "Processed (Last Week)", value: stats.approvedRejectedLastWeek, icon: CheckCircle, variant: "success" },
        { label: "Processed (Last Month)", value: stats.approvedRejectedLastMonth, icon: CheckCircle, variant: "success" },
    ];
    
    return (
        <div className="space-y-6">
            <Header title="Dashboard Overview" />
            
            {/* Main Stats */}
            <Section title="Key Logistics Metrics">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Card key={index} className="flex flex-col items-start p-4">
                                <Icon className={`w-8 h-8 ${card.variant === 'primary' ? 'text-blue-500' : card.variant === 'secondary' ? 'text-purple-500' : card.variant === 'success' ? 'text-green-500' : card.variant === 'error' ? 'text-red-500' : card.variant === 'warning' ? 'text-yellow-500' : 'text-gray-500'} mb-2`} />
                                <p className="text-xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-sm text-gray-500">{card.label}</p>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            {/* Time-Based Request Stats */}
            <Section title="Request & Order Velocity">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {timeStatCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Card key={index} className="flex items-center p-4">
                                <Icon className={`w-6 h-6 ${card.variant === 'success' ? 'text-green-500' : 'text-gray-500'} mr-3`} />
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{card.value}</p>
                                    <p className="text-sm text-gray-500">{card.label}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Section>
            
            <TrackingStatus drivers={drivers} />
        </div>
    );
};

// --- UPDATED FLEET TRACKING COMPONENT ---
const FleetTracking = ({ tracks, drivers }) => {
    // Combine track data with driver status
    const trackDetails = tracks.map(track => {
        const driver = drivers.find(d => d.id === track.assignedDriverId);
        const driverStatus = driver ? driver.status : 'unassigned';
        const driverName = driver ? driver.name : 'N/A';
        const statusColor = getStatusColor(driverStatus);
        
        return {
            ...track,
            driverName,
            driverStatus,
            statusColor
        };
    });

    return (
        <div className="space-y-6">
            <Header title="Fleet Tracking & Availability" />
            
            <Section title="Track List">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck Plate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trackDetails.map(track => (
                                <tr key={track.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{track.plate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{track.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={track.isAvailable ? 'success' : 'error'}>{track.isAvailable ? 'Available' : 'Maintenance'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{track.driverName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={track.statusColor}>{track.driverStatus.toUpperCase().replace(/_/g, ' ')}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
            
            <TrackingStatus drivers={drivers} />
        </div>
    );
};

const Messages = () => <Section title="Messages"><p className="text-gray-500">Message inbox here...</p></Section>;
const Documents = () => <Section title="Documents"><p className="text-gray-500">Document management here...</p></Section>;
const UserManagement = () => <Section title="User Management"><p className="text-gray-500">User accounts here...</p></Section>;
const Settings = () => <Section title="Settings"><p className="text-gray-500">Application settings here...</p></Section>;
// REMOVED: const About = () => <Section title="About"><p className="text-gray-500">About the application...</p></Section>;
// --- END BOILERPLATE/HELPER COMPONENTS ---

// --- DATA STRUCTURES ----------------------------------------------------
const now = () => new Date().toISOString();
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const SEED_CAR_OWNER_ID = "co1";
const SEED_DRIVER_ID = "d1";
const SEED_OWNER_ID = "o1";

// NEW: Request Statuses
const REQUEST_STATUSES = {
    PENDING: 'pending', // Client request sent, waiting for Driver's first response
    APPROVED_BY_DRIVER: 'approved_by_driver', // Driver acknowledged and approved (Step 3)
    ACCEPTED: 'accepted', // Driver officially accepted, assignment complete (Step 4, 5)
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
};

// EXPANDED DRIVER STATUS OPTIONS
const DRIVER_STATUS_OPTIONS = [
  { value: "idle", label: "Idle", color: "gray" },
  { value: "pending_request", label: "Pending Request", color: "orange" }, 
  { value: "loading", label: "Loading (Waybill)", color: "yellow" },
  { value: "in-transit", label: "In Transit", color: "blue" },
  { value: "custom-reached", label: "Customs Reached", color: "purple" },
  { value: "unloading", label: "Unloading", color: "red" },
  { value: "purchaser-reached", label: "Delivered", color: "green" }
];

const seedDrivers = [
  {
    id: SEED_DRIVER_ID,
    name: "Ahmed Ali",
    address: "Hargeisa, Togdheer Rd",
    phone: "+25263 555 1122",
    status: "idle", // Start in idle for new request test
    truckNumber: "SL-TRK-9921",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    assignedClientId: null,
    identityVerified: true,
    currentLocation: { lat: 9.5616, lng: 44.0650 },
    routeProgress: 0
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    phone: "+25263 777 9010",
    status: "idle",
    truckNumber: "SL-TRK-4410",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.2,
    assignedClientId: null,
    identityVerified: true,
    currentLocation: { lat: 10.4340, lng: 45.0140 },
    routeProgress: 0
  },
];

const seedOwners = [
  { 
    id: SEED_OWNER_ID, 
    name: "Abdi Buyer Co.", 
    location: "Hargeisa Market", 
    phone: "+25263 600 1010", 
    email: "abdi@buyerco.com",
    contactPerson: "Abdi Hassan",
    assignedDrivers: [],
    rating: 4.7
  },
  { 
    id: "o2", 
    name: "Zahra Import Export", 
    location: "Borama Trade Center", 
    phone: "+25263 600 2020", 
    email: "info@zahraimport.com",
    contactPerson: "Zahra Mohamed",
    assignedDrivers: [],
    rating: 4.3
  },
];

const seedTracks = [
  { id: "t1", plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, assignedDriverId: SEED_DRIVER_ID },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: true, assignedDriverId: "d2" },
];

const seedRequests = [
    { 
        id: 'req1', 
        clientId: SEED_OWNER_ID, 
        clientName: seedOwners.find(o => o.id === SEED_OWNER_ID)?.name, 
        driverId: SEED_DRIVER_ID, 
        driverName: seedDrivers.find(d => d.id === SEED_DRIVER_ID)?.name, 
        cargo: 'Machinery Import to Hargeisa', 
        origin: 'Berbera Port',
        destination: 'Hargeisa Warehouse',
        status: REQUEST_STATUSES.PENDING, 
        createdAt: now(), 
        driverWaybillUrl: null,
        clientWaybillUrl: null,
        currentDriverStatus: 'pending_request',
    },
];

const seedUsers = [
    { id: 'u1', username: 'admin', password: 'password123', role: 'admin', name: 'System Administrator', permissions: ['all'] },
    { id: 'u2', username: 'ahmed_ali', password: 'driver123', role: 'driver', name: 'Ahmed Ali', permissions: [] },
    { id: 'u3', username: 'abdi_buyer', password: 'owner123', role: 'owner', name: 'Abdi Hassan', permissions: [] },
];

// --- UTILITY FUNCTIONS ---
const getStatusColor = (status) => {
  const statusMap = {
    "idle": "default",
    "pending_request": "warning",
    "loading": "warning",
    "in-transit": "primary",
    "custom-reached": "secondary",
    "unloading": "error",
    "purchaser-reached": "success",
    "unassigned": "default" // Added for Fleet Tracking
  };
  return statusMap[status] || "default";
};

const getRequestStatusVariant = (status) => {
    switch(status) {
        case REQUEST_STATUSES.PENDING: return 'warning';
        case REQUEST_STATUSES.APPROVED_BY_DRIVER: return 'secondary';
        case REQUEST_STATUSES.ACCEPTED: return 'primary';
        case REQUEST_STATUSES.REJECTED:
        case REQUEST_STATUSES.CANCELED: return 'error';
        case REQUEST_STATUSES.COMPLETED: return 'success';
        default: return 'default';
    }
};

// --- TRACKING STATUS COMPONENT ---

const TrackingStatus = ({ drivers, className = "" }) => {
  const activeDrivers = drivers.filter(driver => 
    driver.status !== 'idle' && driver.assignedClientId
  );

  const getStatusInfo = (status) => {
    // Maps status to a conceptual step in the delivery process (0-5)
    const statusInfo = {
      'idle': { label: 'Idle', color: 'bg-gray-500', step: 0 },
      'pending_request': { label: 'Pending Request', color: 'bg-orange-500', step: 0 },
      'loading': { label: 'Loading', color: 'bg-yellow-500', step: 1 },
      'in-transit': { label: 'In Transit', color: 'bg-blue-500', step: 2 },
      'custom-reached': { label: 'Customs', color: 'bg-purple-500', step: 3 },
      'unloading': { label: 'Unloading', color: 'bg-red-500', step: 4 },
      'purchaser-reached': { label: 'Delivered', color: 'bg-green-500', step: 5 }
    };
    return statusInfo[status] || { label: status, color: 'bg-gray-500', step: 0 };
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4">Live Tracking</h3>
      
      {activeDrivers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No active deliveries</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeDrivers.map(driver => {
            const statusInfo = getStatusInfo(driver.status);
            const progress = driver.routeProgress || 0;
            
            return (
              <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={driver.photoUrl} 
                      alt={driver.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{driver.name}</h4>
                      <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Origin</span>
                    <span>Destination</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${statusInfo.color} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Status timeline */}
                <div className="flex justify-between relative">
                  {[1, 2, 3, 4, 5].map(step => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        step <= statusInfo.step ? statusInfo.color : 'bg-gray-300'
                      }`}>
                        {step}
                      </div>
                      <span className="text-xs text-gray-600 mt-1 text-center">
                        {['Loading', 'Transit', 'Customs', 'Unloading', 'Delivered'][step - 1]}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Current location */}
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>Current: {driver.currentLocation ? `${driver.currentLocation.lat.toFixed(4)}, ${driver.currentLocation.lng.toFixed(4)}` : 'Tracking...'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "requests", label: "Requests & Orders", icon: FileText }, 
    { id: "drivers", label: "Driver Management", icon: User },
    { id: "owners", label: "Client Management", icon: Truck },
    { id: "fleet", label: "Fleet Tracking", icon: Car },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "user-management", label: "User Management", icon: Shield },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    // REMOVED: { id: "about", label: "About", icon: Info },
  ];
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HeeyLogistics</h1>
            <p className="text-blue-200 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentTab === item.id 
                  ? "bg-blue-700 text-white shadow-md" 
                  : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-700/30">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-blue-200 truncate">Administrator</p>
          </div>
          <Button variant="outline" size="sm" className="!text-blue-200 !border-blue-600">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- REQUEST MANAGEMENT COMPONENT (Admin View) --------------------------------
const RequestManagement = ({ requests, drivers, onDriverResponse }) => {
    return (
        <div className="space-y-6">
            <Header title="Request & Order Management" />
            <Section title="All Logistics Requests">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Cargo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waybills</th>
                                <th className="relative px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map(req => {
                                const driver = drivers.find(d => d.id === req.driverId);
                                return (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-medium text-gray-900 truncate w-32">{req.cargo}</p>
                                        <p className="text-sm text-gray-500">Route: {req.origin} to {req.destination}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.driverName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={getRequestStatusVariant(req.status)}>{req.status.replace(/_/g, ' ').toUpperCase()}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {req.status === REQUEST_STATUSES.ACCEPTED ? (
                                            <Badge variant={getStatusColor(driver?.status)}>{driver?.status.toUpperCase().replace(/_/g, ' ') || 'IDLE'}</Badge>
                                        ) : (
                                            <span className="text-sm text-gray-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <a href={req.driverWaybillUrl} target="_blank" className={`text-blue-600 hover:text-blue-800 ${!req.driverWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>Driver WB {req.driverWaybillUrl ? '✔' : '❌'}</a><br/>
                                        <a href={req.clientWaybillUrl} target="_blank" className={`text-blue-600 hover:text-blue-800 ${!req.clientWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>Client WB {req.clientWaybillUrl ? '✔' : '❌'}</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {req.status === REQUEST_STATUSES.PENDING && (
                                            <div className="space-x-2">
                                                <Button size="sm" variant="success" onClick={() => onDriverResponse(req.id, 'accept')}>Force Accept</Button>
                                            </div>
                                        )}
                                        {req.status === REQUEST_STATUSES.ACCEPTED && (
                                            <Button size="sm" variant="secondary" onClick={() => onDriverResponse(req.id, 'completed')}>Mark Complete</Button>
                                        )}
                                        {(req.status === REQUEST_STATUSES.PENDING || req.status === REQUEST_STATUSES.APPROVED_BY_DRIVER) && (
                                            <Button size="sm" variant="error" onClick={() => onDriverResponse(req.id, 'reject')} className="ml-2">Reject</Button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Section>
        </div>
    );
};

// --- DRIVER DASHBOARD VIEW (Driver Role Simulation) ----------------------------
const DriverDashboardView = ({ drivers, requests, onDriverResponse, onDriverStatusUpdate, currentDriver }) => {
    
    // Filter requests for the current driver
    const pendingRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.PENDING);
    const approvedRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.APPROVED_BY_DRIVER);
    const activeRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.ACCEPTED);
    
    const [newStatus, setNewStatus] = useState(currentDriver.status);
    const [waybillFile, setWaybillFile] = useState(null);

    // Step 8 & 6: Driver Status Change and Waybill Upload
    const handleStatusUpdate = (e) => {
        e.preventDefault();
        onDriverStatusUpdate(currentDriver.id, newStatus, newStatus === 'loading' ? waybillFile : null);
        setWaybillFile(null); 
        // alert(`Status updated to ${newStatus}. Waybill upload handled.`);
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Dashboard: {currentDriver.name}</h2>

            {/* Status Update & Waybill Upload */}
            <Section title="Update Current Status (Step 8 & 6)">
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1 w-full">
                            <Select 
                                label={`Driver Status: ${currentDriver.status.toUpperCase().replace(/_/g, ' ')}`}
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                options={DRIVER_STATUS_OPTIONS.filter(o => o.value !== 'pending_request')} 
                            />
                        </div>
                        <div className="flex-1 w-full">
                            {newStatus === 'loading' && (
                                <FileUpload 
                                    label="Upload Waybill Receipt (Step 6)"
                                    onFileChange={(e) => setWaybillFile(e.target.files[0])}
                                />
                            )}
                        </div>
                        <Button type="submit" className="h-10 w-full md:w-auto" disabled={newStatus === currentDriver.status}>Update Status</Button>
                    </div>
                </form>
            </Section>

            {/* Incoming Requests */}
            <Section title="Incoming Shipment Requests (Step 3)">
                <div className="space-y-4">
                    {pendingRequests.map(req => (
                        <Card key={req.id} className="p-4 border border-yellow-200 bg-yellow-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Request from {req.clientName}</h4>
                                    <p className="text-sm text-gray-600">Cargo: {req.cargo} | Route: {req.origin} to {req.destination}</p>
                                </div>
                                <Badge variant="warning">PENDING</Badge>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => onDriverResponse(req.id, 'approve')}>
                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve Request
                                </Button>
                                <Button size="sm" variant="error" onClick={() => onDriverResponse(req.id, 'reject')}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {pendingRequests.length === 0 && <p className="text-gray-500">No new pending requests.</p>}
                </div>
            </Section>

            {/* Approved Requests (Ready for Acceptance) */}
            <Section title="Approved Requests (Awaiting Acceptance - Step 4)">
                <div className="space-y-4">
                    {approvedRequests.map(req => (
                        <Card key={req.id} className="p-4 border border-purple-200 bg-purple-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Request for {req.cargo}</h4>
                                    <p className="text-sm text-gray-600">Client: {req.clientName} | **Ready for Pickup**</p>
                                </div>
                                <Badge variant="secondary">APPROVED</Badge>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                                <Button size="sm" variant="success" onClick={() => onDriverResponse(req.id, 'accept')}>
                                    <Truck className="w-4 h-4 mr-1" /> Accept & Assign (Step 4 & 5)
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {approvedRequests.length === 0 && <p className="text-gray-500">No approved requests ready for acceptance.</p>}
                </div>
            </Section>
            
            {/* Active Requests */}
            <Section title="Active Assigned Shipments">
                <div className="space-y-4">
                    {activeRequests.map(req => (
                        <Card key={req.id} className="p-4 border border-blue-200 bg-blue-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{req.cargo} (Route: {req.origin} to {req.destination})</h4>
                                    <p className="text-sm text-gray-600">Client: {req.clientName} | Current Status: <Badge variant={getStatusColor(currentDriver.status)}>{currentDriver.status.toUpperCase().replace(/_/g, ' ')}</Badge></p>
                                    <a href={req.driverWaybillUrl} target="_blank" className={`text-blue-600 text-xs mt-1 block ${!req.driverWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>Driver Waybill {req.driverWaybillUrl ? '✔' : '❌'}</a>
                                </div>
                                <div>
                                    <Badge variant="primary">ACCEPTED</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {activeRequests.length === 0 && <p className="text-gray-500">No active shipments.</p>}
                </div>
            </Section>
        </div>
    );
};


// --- DRIVER MANAGEMENT COMPONENT (Admin/Driver View) --------------------------------
const DriverManagement = ({ drivers, requests, onDriverStatusUpdate, onDriverResponse, onSaveDriver, onDeleteDriver }) => {
    // Simulating the current Driver logged in
    const currentDriver = drivers.find(d => d.id === SEED_DRIVER_ID);
    
    // --- Admin Form Logic (omitted for brevity) ---
    const [editingDriver, setEditingDriver] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    if (!currentDriver) return <div>Driver not found.</div>;

    return (
        <div className="space-y-6">
            {/* Admin Header and Add Driver button */}
            <Header title="Driver Management (Admin/Driver View)" actions={
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Driver
                </Button>
            } />

            {/* --- SIMULATED DRIVER DASHBOARD --- */}
            <DriverDashboardView 
                drivers={drivers}
                requests={requests}
                onDriverResponse={onDriverResponse}
                onDriverStatusUpdate={onDriverStatusUpdate}
                currentDriver={currentDriver}
            />
            {/* ---------------------------------- */}
            
            {/* Admin Table View */}
            <Section title="All Drivers (Admin View)">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck/Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification/Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Client</th>
                                <th className="relative px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {drivers.map(driver => (
                                <tr key={driver.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img src={driver.photoUrl} alt={driver.name} className="h-10 w-10 rounded-full mr-4 object-cover" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                                <div className="text-sm text-gray-500">{driver.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <p>{driver.truckNumber}</p>
                                        <p className="text-xs text-gray-500">{driver.co_name || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={getStatusColor(driver.status)}>{driver.status.toUpperCase().replace(/_/g, ' ')}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {driver.identityVerified ? (
                                                <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Verified</Badge>
                                            ) : (
                                                <Badge variant="error"><AlertCircle className="w-3 h-3 mr-1" /> Unverified</Badge>
                                            )}
                                        </div>
                                        <RatingStars rating={driver.rating} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {driver.assignedClientId || 'None'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-2 justify-end">
                                            <Button size="sm" variant="secondary" onClick={() => {/* Simulate Waybill Upload Modal */}}>
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={() => setEditingDriver(driver)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="error" onClick={() => onDeleteDriver && onDeleteDriver(driver.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </div>
    );
};

// --- CLIENT DASHBOARD VIEW (Client Role Simulation) ----------------------------
const ClientDashboardView = ({ drivers, requests, currentClient, onSendRequest, onClientWaybillUpload }) => {
    
    // Step 1: Available drivers must be idle and not tied to a pending request
    const availableDrivers = drivers.filter(d => 
        d.status === 'idle' && 
        !requests.some(r => r.driverId === d.id && r.status !== REQUEST_STATUSES.REJECTED && r.status !== REQUEST_STATUSES.COMPLETED)
    );
    
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [cargoDetails, setCargoDetails] = useState({ cargo: '', origin: 'Berbera Port', destination: 'Hargeisa Warehouse' });

    // Find the currently active request for tracking for the current client
    const activeRequest = requests.find(r => r.clientId === currentClient.id && r.status === REQUEST_STATUSES.ACCEPTED);
    const assignedDriver = activeRequest ? drivers.find(d => d.id === activeRequest.driverId) : null;
    
    // Step 2: Client sends request
    const handleRequestSubmit = () => {
        if (selectedDriverId && cargoDetails.cargo && cargoDetails.origin && cargoDetails.destination) {
            onSendRequest(currentClient.id, selectedDriverId, cargoDetails.cargo, cargoDetails.origin, cargoDetails.destination);
            setSelectedDriverId(null);
            setCargoDetails({ cargo: '', origin: 'Berbera Port', destination: 'Hargeisa Warehouse' });
            // alert('Shipment request sent successfully!');
        } else {
            alert('Please select a driver and fill in all shipment details.');
        }
    };

    // Step 7: Client waybill upload
    const handleWaybillUpload = (requestId, file) => {
        onClientWaybillUpload(requestId, file);
        // alert(`Client Waybill uploaded for Request ${requestId}.`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Dashboard: {currentClient.name}</h2>

            {/* Step 9: Client Tracks Status */}
            <Section title="Active Order Tracking (Step 9)">
                {assignedDriver ? (
                    <div>
                        <h3 className="font-medium text-gray-900">Driver: {assignedDriver.name} | Truck: {assignedDriver.truckNumber}</h3>
                        <p className="text-sm text-gray-600 mb-2">Request ID: {activeRequest.id.slice(0, 6)} | Cargo: {activeRequest.cargo}</p>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <p className="text-lg font-bold text-gray-900">Current Status: <Badge variant={getStatusColor(assignedDriver.status)}>{assignedDriver.status.toUpperCase().replace(/_/g, ' ')}</Badge></p>
                        </div>
                        <TrackingStatus drivers={[assignedDriver]} className="mt-4 p-0 shadow-none border-none" />
                    </div>
                ) : (
                    <p className="text-gray-500">No active assigned drivers. Send a request below to get started!</p>
                )}
            </Section>

            {/* Step 1 & 2: View Available Drivers and Send Request */}
            <Section title="Send New Shipment Request (Steps 1 & 2)">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-medium text-gray-900">Available Drivers/Tracks (Step 1)</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {availableDrivers.map(driver => (
                                <Card 
                                    key={driver.id} 
                                    className={`p-3 cursor-pointer transition ${selectedDriverId === driver.id ? 'border-blue-500 ring-2 ring-blue-500' : 'hover:border-blue-300'}`}
                                    onClick={() => setSelectedDriverId(driver.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{driver.name}</p>
                                                <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                                            </div>
                                        </div>
                                        {selectedDriverId === driver.id && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    </div>
                                </Card>
                            ))}
                            {availableDrivers.length === 0 && <p className="text-gray-500 text-center">No idle drivers available right now.</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Shipment Details</h3>
                        <Input 
                            label="Cargo Description" 
                            value={cargoDetails.cargo} 
                            onChange={(e) => setCargoDetails({...cargoDetails, cargo: e.target.value})}
                        />
                         <Input 
                            label="Origin" 
                            value={cargoDetails.origin} 
                            onChange={(e) => setCargoDetails({...cargoDetails, origin: e.target.value})}
                        />
                         <Input 
                            label="Destination" 
                            value={cargoDetails.destination} 
                            onChange={(e) => setCargoDetails({...cargoDetails, destination: e.target.value})}
                        />
                        <Button 
                            onClick={handleRequestSubmit} 
                            disabled={!selectedDriverId || !cargoDetails.cargo}
                            className="w-full"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" /> Send Request
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Client Waybill Upload and Request Status Monitoring */}
            <Section title="My Requests Status & Waybills (Step 7)">
                <div className="space-y-4">
                    {requests.filter(r => r.clientId === currentClient.id).map(req => (
                        <Card key={req.id} className="p-4 border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{req.cargo} (Req ID: {req.id.slice(0, 6)})</h4>
                                    <p className="text-sm text-gray-600">Driver: {req.driverName} | Status: <Badge variant={getRequestStatusVariant(req.status)}>{req.status.toUpperCase().replace(/_/g, ' ')}</Badge></p>
                                </div>
                                
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-700">Client Waybill Receipt (Step 7):</p>
                                {req.clientWaybillUrl ? (
                                    <a href={req.clientWaybillUrl} target="_blank" className="text-green-600 text-sm flex items-center space-x-1">
                                        <CheckCircle className="w-4 h-4" /> <span>View Uploaded</span>
                                    </a>
                                ) : (
                                    req.status === REQUEST_STATUSES.ACCEPTED ? (
                                        <FileUpload 
                                            label=""
                                            onFileChange={(e) => e.target.files.length > 0 && handleWaybillUpload(req.id, e.target.files[0])}
                                            className="w-48"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">Available after Acceptance</p>
                                    )
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
                {requests.filter(r => r.clientId === currentClient.id).length === 0 && <p className="text-gray-500 text-center">No requests initiated yet.</p>}
            </Section>
        </div>
    );
};


// --- CLIENT MANAGEMENT COMPONENT (Admin/Client View) -------------------------------
const ClientManagement = ({ drivers, owners, requests, onSendRequest, onClientWaybillUpload, onSaveOwner, onDeleteOwner }) => {
    // Simulating the current Client logged in 
    const currentClient = owners.find(o => o.id === SEED_OWNER_ID);

    if (!currentClient) return <div>Client not found.</div>;

    return (
        <div className="space-y-6">
            <Header title="Client Management (Admin/Client View)" />

            {/* --- SIMULATED CLIENT DASHBOARD --- */}
            <ClientDashboardView 
                drivers={drivers}
                requests={requests}
                currentClient={currentClient}
                onSendRequest={onSendRequest}
                onClientWaybillUpload={onClientWaybillUpload}
                owners={owners}
            />
            {/* ---------------------------------- */}
            
            {/* Admin Table View */}
            <Section title="All Clients (Admin View)">
                {/* ... Admin table logic here ... */}
                <p className="text-gray-500">Admin table for all clients.</p>
            </Section>
        </div>
    );
};


// --- APP COMPONENT (Updated with State and Handlers) ---------------------

const App = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [users, setUsers] = useState(seedUsers);
  const [messages, setMessages] = useState([]); // Removed seed messages to keep console clean

  // NEW: Requests state
  const [requests, setRequests] = useState(seedRequests);

  // --- STATS CALCULATION FUNCTION (New Implementation) ---
  const calculateStats = (drivers, tracks, requests, owners) => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const totalTracks = tracks.length;
    const totalDrivers = drivers.length;
    const totalClients = owners.length;

    const availableTracks = tracks.filter(t => t.isAvailable).length;
    const unavailableTracks = totalTracks - availableTracks;

    const totalRequests = requests.length;

    const filterRequestsByTime = (reqList, timeThreshold) => 
        reqList.filter(req => new Date(req.createdAt).getTime() >= timeThreshold);

    const requestsLastWeek = filterRequestsByTime(requests, oneWeekAgo);
    const requestsLastMonth = filterRequestsByTime(requests, oneMonthAgo);
    
    // Statuses that count as "processed" (approved, rejected, or completed)
    const PROCESSED_STATUSES = [REQUEST_STATUSES.ACCEPTED, REQUEST_STATUSES.REJECTED, REQUEST_STATUSES.COMPLETED];

    const approvedRejectedLastWeek = requestsLastWeek.filter(req => 
        PROCESSED_STATUSES.includes(req.status)
    ).length;

    const approvedRejectedLastMonth = requestsLastMonth.filter(req => 
        PROCESSED_STATUSES.includes(req.status)
    ).length;

    return {
        totalTracks,
        totalDrivers,
        totalClients,
        availableTracks,
        unavailableTracks,
        totalRequests,
        requestsLastWeek: requestsLastWeek.length,
        requestsLastMonth: requestsLastMonth.length,
        approvedRejectedLastWeek,
        approvedRejectedLastMonth
    };
  };

  // --- MEMOIZED STATS (Updated) ---
  const stats = useMemo(() => calculateStats(drivers, tracks, requests, owners), [drivers, tracks, requests, owners]);


  // --- NEW WORKFLOW HANDLERS ---

    // 1. Client sends a request (Step 2)
    const handleSendRequest = (clientId, driverId, cargo, origin, destination) => {
        const client = owners.find(o => o.id === clientId);
        const driver = drivers.find(d => d.id === driverId);

        if (!client || !driver) return false;

        const newRequest = {
            id: generateId(),
            clientId,
            clientName: client.name,
            driverId,
            driverName: driver.name,
            cargo,
            origin,
            destination,
            status: REQUEST_STATUSES.PENDING,
            createdAt: now(),
            driverWaybillUrl: null,
            clientWaybillUrl: null,
            currentDriverStatus: 'pending_request',
        };
        setRequests(prev => [newRequest, ...prev]);

        // Update driver status to pending request
        setDrivers(prevDrivers => prevDrivers.map(d => 
            d.id === driverId ? { ...d, status: 'pending_request' } : d
        ));

        return true;
    };

    /**
     * @description Handles driver response (Approve, Reject, Accept, Complete)
     * @param {string} requestId 
     * @param {('approve'|'reject'|'accept'|'completed')} action 
     */
    const handleDriverResponse = (requestId, action) => {
        setRequests(prevRequests => prevRequests.map(req => {
            if (req.id === requestId) {
                let newStatus = req.status;
                const driverId = req.driverId;
                const clientId = req.clientId;

                if (action === 'approve') {
                    // Step 3: Driver approves request
                    newStatus = REQUEST_STATUSES.APPROVED_BY_DRIVER;
                } else if (action === 'accept') {
                    // Step 4 & 5: Driver accepts, triggers assignment
                    newStatus = REQUEST_STATUSES.ACCEPTED;
                    
                    // Assign client to driver and set driver status to 'idle' (ready for loading)
                    setDrivers(prevDrivers => prevDrivers.map(d =>
                        d.id === driverId ? { ...d, assignedClientId: clientId, status: 'idle' } : d
                    ));

                    // Update owner's assigned drivers
                    setOwners(prevOwners => prevOwners.map(o =>
                        o.id === clientId ? { ...o, assignedDrivers: [...new Set([...o.assignedDrivers, driverId])] } : o
                    ));
                } else if (action === 'reject' || action === 'completed') {
                    newStatus = action === 'reject' ? REQUEST_STATUSES.REJECTED : REQUEST_STATUSES.COMPLETED;

                    // FIX/IMPROVEMENT: Ensure the driver's assignment is reset and status goes to idle.
                    setDrivers(prevDrivers => prevDrivers.map(d =>
                        d.id === driverId ? { ...d, assignedClientId: null, status: 'idle' } : d
                    ));
                    
                    // Clean up owner's assigned drivers (optional, but good practice)
                    setOwners(prevOwners => prevOwners.map(o =>
                        o.id === clientId ? { ...o, assignedDrivers: o.assignedDrivers.filter(id => id !== driverId) } : o
                    ));
                }

                return { ...req, status: newStatus };
            }
            return req;
        }));
    };

    // 3. Driver changes status and uploads waybill (Steps 6 & 8)
    const handleDriverStatusUpdate = (driverId, newStatus, waybillFile) => {
        // Step 8: Update driver status
        setDrivers(prevDrivers => {
            const updatedDrivers = prevDrivers.map(d => 
                d.id === driverId ? { ...d, status: newStatus } : d
            );
            return updatedDrivers;
        });

        // Step 6: Driver waybill upload (only applies to the active, accepted request)
        setRequests(prevRequests => {
            const activeRequest = prevRequests.find(req => 
                req.driverId === driverId && req.status === REQUEST_STATUSES.ACCEPTED
            );
            
            if (activeRequest) {
                // If status is 'loading' and a file is provided, simulate upload
                const driverWaybillUrl = (newStatus === 'loading' && waybillFile) 
                    ? `/driver/${driverId}/${waybillFile.name}` // Simulate file URL
                    : activeRequest.driverWaybillUrl; // Keep existing URL if not loading/uploading

                return prevRequests.map(req => 
                    req.id === activeRequest.id ? 
                    { ...req, driverWaybillUrl, currentDriverStatus: newStatus } : 
                    req
                );
            }
            
            // If no active request, only update driver status
            return prevRequests.map(req => 
                req.driverId === driverId ? 
                { ...req, currentDriverStatus: newStatus } : req
            );
        });
    };

    // 4. Client uploads waybill (Step 7)
    const handleClientWaybillUpload = (requestId, waybillFile) => {
        const waybillUrl = `/client/${requestId}/${waybillFile.name}`; // Simulate file URL
        setRequests(prevRequests => prevRequests.map(req => 
            req.id === requestId ? { ...req, clientWaybillUrl: waybillUrl } : req
        ));
    };

  // --- STUB HANDLERS FOR OTHER COMPONENTS ---
  const handleSaveDriver = () => alert("Driver save not implemented.");
  const handleDeleteDriver = () => alert("Driver delete not implemented.");
  const handleUpdateStatus = () => alert("Admin status update not implemented.");
  const handleSaveOwner = () => alert("Owner save not implemented.");
  const handleDeleteOwner = () => alert("Owner delete not implemented.");
  const handleAssignDriver = () => alert("Assign driver not implemented.");
  const handleUnassignDriver = () => alert("Unassign driver not implemented.");
  const handleRateDriver = () => alert("Rate driver not implemented.");
  const handleMarkArrived = () => alert("Mark arrived not implemented.");
  const handleAssignDriverToTrack = () => alert("Assign driver to track not implemented.");
  const handleSendMessage = () => alert("Send message not implemented.");
  const handleSaveUser = () => alert("Save user not implemented.");
  const handleDeleteUser = () => alert("Delete user not implemented.");
  // FIX: Removed duplicate declaration of handleUpdateAvailability
  const handleUpdateAvailability = () => alert("Update availability not implemented."); 
  // Removed unused useMemo recentActivities
  
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        // Passing stats for the new cards and drivers for the embedded TrackingStatus
        return <Dashboard stats={stats} drivers={drivers} />;
      
      case "requests":
        return <RequestManagement 
            requests={requests}
            drivers={drivers}
            owners={owners}
            onDriverResponse={handleDriverResponse}
        />;
        
      case "drivers":
        return <DriverManagement
          drivers={drivers}
          requests={requests}
          onSaveDriver={handleSaveDriver}
          onDeleteDriver={handleDeleteDriver}
          onUpdateStatus={handleUpdateStatus} 
          onDriverStatusUpdate={handleDriverStatusUpdate} 
          onDriverResponse={handleDriverResponse} 
        />;
      
      case "owners":
        return <ClientManagement
          drivers={drivers}
          owners={owners}
          requests={requests}
          onSendRequest={handleSendRequest} 
          onClientWaybillUpload={handleClientWaybillUpload} 
          onSaveOwner={handleSaveOwner}
          onDeleteOwner={handleDeleteOwner}
        />;
      
      case "fleet":
        // Passing tracks and drivers for the new FleetTracking list
        return <FleetTracking 
            tracks={tracks} 
            drivers={drivers} 
            onUpdateAvailability={handleUpdateAvailability} 
            onAssignDriver={handleAssignDriverToTrack} 
        />;
      case "messages":
        return <Messages messages={messages} onSendMessage={handleSendMessage} drivers={drivers} owners={owners} />;
      case "documents":
        return <Documents drivers={drivers} owners={owners} />;
      case "user-management":
        return <UserManagement users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} />;
      case "settings":
        return <Settings />;
      // REMOVED: case "about": return <About />;
      default:
        return <Dashboard stats={stats} drivers={drivers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;