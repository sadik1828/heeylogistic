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

// --- DATA STRUCTURES ----------------------------------------------------
const now = () => new Date().toISOString();
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const SEED_CAR_OWNER_ID = "co1";
const SEED_DRIVER_ID = "d1";
const SEED_OWNER_ID = "o1";
const SEED_TRACK_ID = "t1";

const seedDrivers = [
  {
    id: SEED_DRIVER_ID,
    name: "Ahmed Ali",
    address: "Hargeisa, Togdheer Rd",
    phone: "+25263 555 1122",
    status: "idle",
    truckNumber: "SL-TRK-9921",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    driverLicenseUrl: "#",
    waybills: [{ id: "w1", name: "Customs Clearance.pdf", uploadedAt: now(), fileUrl: "#" }],
    carOwnerId: SEED_CAR_OWNER_ID,
    co_name: "Mahad Transport Co.",
    co_phone: "+25263 500 1111",
    co_ownershipDocUrl: "#",
    rating: 4.5,
    assignedClientId: SEED_OWNER_ID,
    identityVerified: true,
    currentLocation: { lat: 9.5616, lng: 44.0650 },
    routeProgress: 65
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    phone: "+25263 777 9010",
    status: "custom-reached",
    truckNumber: "SL-TRK-4410",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    driverLicenseUrl: "#",
    waybills: [{ id: "w2", name: "Waybill-INV-009.pdf", uploadedAt: now(), fileUrl: "#" }],
    carOwnerId: "co2",
    co_name: "Sahal Logistics",
    co_phone: "+25263 500 2222",
    co_ownershipDocUrl: "#",
    rating: 4.2,
    assignedClientId: "o2",
    identityVerified: true,
    currentLocation: { lat: 10.4340, lng: 45.0140 },
    routeProgress: 30
  },
  {
    id: "d3",
    name: "Omar Farah",
    address: "Borama Logistics Center",
    phone: "+25263 666 3344",
    status: "purchaser-reached",
    truckNumber: "SL-TRK-1050",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    driverLicenseUrl: "#",
    waybills: [{ id: "w3", name: "Delivery Note.pdf", uploadedAt: now(), fileUrl: "#" }],
    carOwnerId: "co3",
    co_name: "Geeska Transport",
    co_phone: "+25263 500 3333",
    co_ownershipDocUrl: "#",
    rating: 4.8,
    assignedClientId: null,
    identityVerified: false,
    currentLocation: { lat: 9.9349, lng: 43.1809 },
    routeProgress: 90
  },
];

const seedOwners = [
  { 
    id: SEED_OWNER_ID, 
    name: "Abdi Buyer Co.", 
    location: "Hargeisa Market", 
    phone: "+25263 600 1010", 
    waybills: [{ id: "w4", name: "Client Waybill.pdf", uploadedAt: now(), fileUrl: "#" }],
    email: "abdi@buyerco.com",
    contactPerson: "Abdi Hassan",
    assignedDrivers: [SEED_DRIVER_ID],
    rating: 4.7
  },
  { 
    id: "o2", 
    name: "Zahra Import Export", 
    location: "Borama Trade Center", 
    phone: "+25263 600 2020", 
    waybills: [{ id: "w5", name: "Import Documents.pdf", uploadedAt: now(), fileUrl: "#" }],
    email: "info@zahraimport.com",
    contactPerson: "Zahra Mohamed",
    assignedDrivers: ["d2"],
    rating: 4.3
  },
  { 
    id: "o3", 
    name: "Somaliland Goods Ltd.", 
    location: "Hargeisa Industrial Zone", 
    phone: "+25263 600 3030", 
    waybills: [],
    email: "orders@somalilandgoods.com",
    contactPerson: "Mohamed Ahmed",
    assignedDrivers: [],
    rating: 4.9
  },
];

const seedTracks = [
  { id: SEED_TRACK_ID, plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, carOwnerId: SEED_CAR_OWNER_ID, assignedDriverId: SEED_DRIVER_ID },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: false, carOwnerId: "co2", assignedDriverId: "d2" },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2" },
  { id: "t4", plate: "SL-TRK-1050", model: "Mercedes Actros", isAvailable: false, carOwnerId: "co3", assignedDriverId: "d3" },
];

const seedUsers = [
    { id: 'u1', username: 'admin', password: 'password123', role: 'admin', name: 'System Administrator', permissions: ['all'] },
    { id: 'u2', username: 'ahmed_ali', password: 'driver123', role: 'driver', name: 'Ahmed Ali', permissions: [] },
    { id: 'u3', username: 'abdi_buyer', password: 'owner123', role: 'owner', name: 'Abdi Hassan', permissions: [] },
    { id: 'u4', username: 'moderator', password: 'mod123', role: 'admin', name: 'Moderator User', permissions: ['read', 'update'] },
];

const seedMessages = [
    { id: "m1", from: "owner", toId: SEED_DRIVER_ID, text: "Driver on the way to customs?", at: now() },
    { id: "m2", from: "driver", toId: "u1", text: "Yes, 10 minutes out from customs.", at: now() },
    { id: "m3", from: "admin", toId: "o2", text: "Zahra, please check your waybill upload.", at: now() },
];

// --- CHART COMPONENTS ----------------------------------------------------

const BarChart = ({ data, title, className = "" }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 w-20 truncate">{item.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChart = ({ data, title, className = "" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercent = 0;
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0;
              const dashArray = `${percent} ${100 - percent}`;
              const offset = accumulatedPercent;
              accumulatedPercent += percent;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-600 flex-1">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
            <span className="text-sm text-gray-500">({total > 0 ? Math.round((item.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title, className = "" }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y, index) => (
            <line
              key={index}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#3b82f6"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- TRACKING STATUS COMPONENT ------------------------------------------

const TrackingStatus = ({ drivers, className = "" }) => {
  const activeDrivers = drivers.filter(driver => 
    driver.status !== 'idle' && driver.assignedClientId
  );

  const getStatusInfo = (status) => {
    const statusInfo = {
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

// --- STYLED COMPONENTS ----------------------------------------------------

const Section = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {title && <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>}
    {children}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", size = "md", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input 
      type={type}
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea 
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      rows="3"
      {...props}
    />
  </div>
);

const FileUpload = ({ label, onFileChange, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input 
      type="file"
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      onChange={onFileChange}
      {...props}
    />
  </div>
);

const RatingStars = ({ rating, onRatingChange, editable = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex space-x-1">
      {stars.map(star => (
        <button
          key={star}
          type={editable ? "button" : "div"}
          onClick={editable ? () => onRatingChange(star) : undefined}
          className={editable ? "cursor-pointer" : "cursor-default"}
        >
          <Star 
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// --- STATUS HELPER FUNCTION ----------------------------------------------
const getStatusColor = (status) => {
  const statusMap = {
    "idle": "default",
    "loading": "warning",
    "in-transit": "primary",
    "custom-reached": "secondary",
    "unloading": "error",
    "purchaser-reached": "success"
  };
  return statusMap[status] || "default";
};

// --- SIDEBAR COMPONENT ----------------------------------------------------

const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "drivers", label: "Driver Management", icon: User },
    { id: "owners", label: "Client Management", icon: Truck },
    { id: "fleet", label: "Fleet Tracking", icon: Car },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "user-management", label: "User Management", icon: Shield },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col">
      {/* Logo */}
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

      {/* Navigation */}
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

      {/* User Section */}
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

// --- HEADER COMPONENT ----------------------------------------------------

const Header = ({ title, actions }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">Manage your logistics operations efficiently</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
        {actions}
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENT -------------------------------------------------

const Dashboard = ({ stats, recentActivities, drivers, owners, tracks }) => {
  // Chart data
  const statusDistribution = [
    { label: 'Idle', value: drivers.filter(d => d.status === 'idle').length },
    { label: 'Loading', value: drivers.filter(d => d.status === 'loading').length },
    { label: 'In Transit', value: drivers.filter(d => d.status === 'in-transit').length },
    { label: 'Customs', value: drivers.filter(d => d.status === 'custom-reached').length },
    { label: 'Unloading', value: drivers.filter(d => d.status === 'unloading').length },
    { label: 'Delivered', value: drivers.filter(d => d.status === 'purchaser-reached').length }
  ];

  const monthlyPerformance = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 60 },
    { label: 'May', value: 65 },
    { label: 'Jun', value: 70 }
  ];

  const vehicleTypes = [
    { label: 'Hino', value: tracks.filter(t => t.model.includes('Hino')).length },
    { label: 'Isuzu', value: tracks.filter(t => t.model.includes('Isuzu')).length },
    { label: 'Fuso', value: tracks.filter(t => t.model.includes('Fuso')).length },
    { label: 'Mercedes', value: tracks.filter(t => t.model.includes('Mercedes')).length }
  ];

  return (
    <div className="space-y-6">
      <Header title="Dashboard Overview" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
            <p className={`text-sm mt-1 ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last month
            </p>
          </Card>
        ))}
      </div>

      {/* Charts and Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Pie Chart */}
        <PieChart 
          data={statusDistribution}
          title="Driver Status Distribution"
        />
        
        {/* Monthly Performance Line Chart */}
        <LineChart 
          data={monthlyPerformance}
          title="Monthly Delivery Performance"
          className="lg:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Types Bar Chart */}
        <BarChart 
          data={vehicleTypes}
          title="Vehicle Types"
          className="lg:col-span-2"
        />
        
        {/* Live Tracking */}
        <TrackingStatus 
          drivers={drivers}
        />
      </div>

      {/* Recent Activities */}
      <Section title="Recent Activities">
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{activity.time}</p>
                <Badge variant={activity.statusVariant}>{activity.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// --- DRIVER MANAGEMENT COMPONENT -----------------------------------------

const DriverManagement = ({ drivers, onUpdateStatus, onSaveDriver, onDeleteDriver }) => {
  const [editingDriver, setEditingDriver] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    status: "idle",
    truckNumber: "",
    photoUrl: "",
    driverLicenseUrl: "",
    co_name: "",
    co_phone: "",
    co_ownershipDocUrl: "",
    identityVerified: false
  });

  const statusOptions = [
    { value: "idle", label: "Idle", color: "gray" },
    { value: "loading", label: "Loading", color: "yellow" },
    { value: "in-transit", label: "In Transit", color: "blue" },
    { value: "custom-reached", label: "Customs Reached", color: "purple" },
    { value: "unloading", label: "Unloading", color: "red" },
    { value: "purchaser-reached", label: "Purchaser Reached", color: "green" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const driverData = {
      ...formData,
      id: editingDriver?.id || generateId(),
      waybills: editingDriver?.waybills || [],
      rating: editingDriver?.rating || 0,
      assignedClientId: editingDriver?.assignedClientId || null,
      currentLocation: editingDriver?.currentLocation || { lat: 9.5616, lng: 44.0650 },
      routeProgress: editingDriver?.routeProgress || 0
    };

    onSaveDriver(driverData);
    resetForm();
  };

  const resetForm = () => {
    setEditingDriver(null);
    setIsFormOpen(false);
    setFormData({
      name: "",
      address: "",
      phone: "",
      status: "idle",
      truckNumber: "",
      photoUrl: "",
      driverLicenseUrl: "",
      co_name: "",
      co_phone: "",
      co_ownershipDocUrl: "",
      identityVerified: false
    });
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      address: driver.address,
      phone: driver.phone,
      status: driver.status,
      truckNumber: driver.truckNumber,
      photoUrl: driver.photoUrl,
      driverLicenseUrl: driver.driverLicenseUrl,
      co_name: driver.co_name,
      co_phone: driver.co_phone,
      co_ownershipDocUrl: driver.co_ownershipDocUrl,
      identityVerified: driver.identityVerified
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: fileUrl });
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Driver Management" 
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Driver
          </Button>
        } 
      />
      
      {/* Driver Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <Input
                  label="Truck Number"
                  value={formData.truckNumber}
                  onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                  required
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={statusOptions}
                />
                <Input
                  label="Photo URL"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
                <Input
                  label="Car Owner Name"
                  value={formData.co_name}
                  onChange={(e) => setFormData({ ...formData, co_name: e.target.value })}
                  required
                />
                <Input
                  label="Car Owner Phone"
                  value={formData.co_phone}
                  onChange={(e) => setFormData({ ...formData, co_phone: e.target.value })}
                  required
                />
              </div>
              
              <FileUpload
                label="Driver License"
                onFileChange={(e) => handleFileUpload('driverLicenseUrl', e)}
              />
              
              <FileUpload
                label="Ownership Document"
                onFileChange={(e) => handleFileUpload('co_ownershipDocUrl', e)}
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="identityVerified"
                  checked={formData.identityVerified}
                  onChange={(e) => setFormData({ ...formData, identityVerified: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="identityVerified" className="text-sm text-gray-700">
                  Identity Verified
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Section>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle/Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map(driver => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={driver.photoUrl} alt={driver.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.address} | {driver.phone}</div>
                        {driver.identityVerified && (
                          <Badge variant="success" className="mt-1">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.truckNumber}</div>
                    <div className="text-sm text-gray-500">{driver.co_name} (Owner)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={driver.status}
                      onChange={(e) => onUpdateStatus(driver.id, e.target.value)}
                      options={statusOptions}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RatingStars rating={driver.rating || 0} />
                    <span className="text-sm text-gray-600 ml-2">{driver.rating || 0}/5</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <a href={driver.driverLicenseUrl} className="text-blue-600 hover:underline flex items-center">
                        <FileText className="w-4 h-4 mr-1" />License
                      </a>
                      <a href={driver.waybills[0]?.fileUrl || '#'} className="text-blue-600 hover:underline flex items-center">
                        <FileText className="w-4 h-4 mr-1" />Waybill
                      </a>
                      <a href={driver.co_ownershipDocUrl} className="text-blue-600 hover:underline flex items-center">
                        <FileText className="w-4 h-4 mr-1" />Owner Doc
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="error" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Delete ${driver.name}?`)) {
                          onDeleteDriver(driver.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

// --- CLIENT MANAGEMENT COMPONENT -----------------------------------------

const ClientManagement = ({ owners, drivers, onSaveOwner, onDeleteOwner, onAssignDriver, onUnassignDriver, onRateDriver, onMarkArrived }) => {
  const [editingOwner, setEditingOwner] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [newWaybill, setNewWaybill] = useState({ name: "", file: null });
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOwner) {
      onSaveOwner({ ...editingOwner, ...formData });
    } else {
      onSaveOwner({
        ...formData,
        waybills: [],
        assignedDrivers: [],
        rating: 0
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingOwner(null);
    setIsFormOpen(false);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      location: ""
    });
  };

  const handleEdit = (owner) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      contactPerson: owner.contactPerson || "",
      email: owner.email || "",
      phone: owner.phone,
      location: owner.location
    });
    setIsFormOpen(true);
  };

  const handleWaybillUpload = (ownerId) => {
    if (newWaybill.name && newWaybill.file) {
      const waybill = {
        id: generateId(),
        name: newWaybill.name,
        fileUrl: URL.createObjectURL(newWaybill.file),
        uploadedAt: now()
      };
      
      const updatedOwners = owners.map(owner => 
        owner.id === ownerId 
          ? { ...owner, waybills: [...owner.waybills, waybill] }
          : owner
      );
      
      onSaveOwner(updatedOwners.find(o => o.id === ownerId));
      setNewWaybill({ name: "", file: null });
    }
  };

  const availableDrivers = drivers.filter(driver => 
    !driver.assignedClientId || driver.assignedClientId === selectedOwner?.id
  );

  return (
    <div className="space-y-6">
      <Header 
        title="Client Management" 
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        } 
      />

      {/* Client Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingOwner ? 'Edit Client' : 'Add New Client'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Contact Person"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="Location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
              />
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingOwner ? 'Update' : 'Create'} Client
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map(owner => (
          <Card key={owner.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{owner.name}</h3>
                <p className="text-sm text-gray-600">{owner.contactPerson}</p>
                <RatingStars rating={owner.rating || 0} />
              </div>
              <div className="text-right">
                <span className="text-blue-600 text-sm font-medium flex items-center">
                  <Upload className="w-4 h-4 mr-1" /> ({owner.waybills.length} waybills)
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {owner.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {owner.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {owner.location}
              </div>
            </div>

            {/* Waybill Upload Section */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Upload Waybill</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Waybill name"
                  value={newWaybill.name}
                  onChange={e => setNewWaybill({ ...newWaybill, name: e.target.value })}
                />
                <input
                  type="file"
                  onChange={e => setNewWaybill({ ...newWaybill, file: e.target.files[0] })}
                  className="w-full text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={() => handleWaybillUpload(owner.id)}
                  disabled={!newWaybill.name || !newWaybill.file}
                >
                  Upload Waybill
                </Button>
              </div>
            </div>

            {/* Assigned Drivers Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Assigned Drivers:</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedOwner(selectedOwner?.id === owner.id ? null : owner)}
                >
                  {selectedOwner?.id === owner.id ? 'Close' : 'Manage Drivers'}
                </Button>
              </div>
              
              {owner.assignedDrivers && owner.assignedDrivers.length > 0 ? (
                <div className="space-y-2">
                  {owner.assignedDrivers.map(driverId => {
                    const driver = drivers.find(d => d.id === driverId);
                    if (!driver) return null;
                    
                    return (
                      <div key={driverId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={driver.photoUrl} 
                            alt={driver.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-sm font-medium">{driver.name}</span>
                            <Badge variant={getStatusColor(driver.status)} className="ml-2">
                              {driver.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => onMarkArrived(owner.id, driverId)}
                          >
                            Arrived
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onUnassignDriver(owner.id, driverId)}
                          >
                            Unassign
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No drivers assigned</p>
              )}
            </div>

            {/* Driver Assignment Section */}
            {selectedOwner?.id === owner.id && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Assign Driver:</h4>
                <Select
                  options={[
                    { value: '', label: 'Select Driver' },
                    ...availableDrivers.map(d => ({ 
                      value: d.id, 
                      label: `${d.name} (${d.truckNumber}) - ${d.status}` 
                    }))
                  ]}
                  onChange={(e) => {
                    if (e.target.value) {
                      onAssignDriver(owner.id, e.target.value);
                    }
                  }}
                />
              </div>
            )}

            <div className="flex space-x-2 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(owner)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button 
                variant="error" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (window.confirm(`Delete ${owner.name}?`)) {
                    onDeleteOwner(owner.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- FLEET TRACKING COMPONENT --------------------------------------------

const FleetTracking = ({ tracks, onUpdateAvailability, onAssignDriver, drivers }) => {
  const availableDrivers = drivers.filter(driver => !driver.assignedClientId);

  return (
    <div className="space-y-6">
      <Header title="Fleet Tracking" />
      
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(track => {
            const assignedDriver = drivers.find(d => d.id === track.assignedDriverId);
            
            return (
              <Card key={track.id} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{track.plate}</h3>
                    <p className="text-sm text-gray-600">{track.model}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${track.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {track.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Button 
                      variant={track.isAvailable ? "success" : "warning"} 
                      size="sm"
                      onClick={() => onUpdateAvailability(track.id, !track.isAvailable)}
                    >
                      {track.isAvailable ? 'Available' : 'Set Available'}
                    </Button>
                  </div>
                  
                  {assignedDriver ? (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={assignedDriver.photoUrl} 
                          alt={assignedDriver.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{assignedDriver.name}</p>
                          <p className="text-xs text-gray-600">{assignedDriver.phone}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={getStatusColor(assignedDriver.status)}>
                          {assignedDriver.status.replace('-', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => onAssignDriver(track.id, null)}>
                          Unassign
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Select
                        label="Assign Driver:"
                        options={[
                          { value: '', label: 'Select Driver' },
                          ...availableDrivers.map(d => ({ value: d.id, label: `${d.name} (${d.phone})` }))
                        ]}
                        onChange={(e) => {
                          if (e.target.value) {
                            onAssignDriver(track.id, e.target.value);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

// --- MESSAGES COMPONENT --------------------------------------------------

const Messages = ({ messages, onSendMessage, drivers, owners }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const allRecipients = [
    ...drivers.map(d => ({ ...d, type: 'driver', displayName: d.name })),
    ...owners.map(o => ({ ...o, type: 'owner', displayName: o.name }))
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedRecipient) {
      onSendMessage(selectedRecipient.id, newMessage);
      setNewMessage('');
    }
  };

  const filteredMessages = messages.filter(msg => 
    selectedRecipient && 
    ((msg.from === 'admin' && msg.toId === selectedRecipient.id) || 
     (msg.from !== 'admin' && selectedRecipient.type === 'admin'))
  );

  return (
    <div className="space-y-6">
      <Header title="Messages" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <Section className="lg:col-span-1">
          <h3 className="font-semibold mb-4">Contacts</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allRecipients.map(recipient => (
              <button
                key={recipient.id}
                onClick={() => setSelectedRecipient(recipient)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRecipient?.id === recipient.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="font-medium text-gray-900">{recipient.displayName}</div>
                <div className="text-sm text-gray-600 capitalize">{recipient.type}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Chat Area */}
        <Section className="lg:col-span-2">
          {selectedRecipient ? (
            <>
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedRecipient.displayName}</div>
                  <div className="text-sm text-gray-600 capitalize">{selectedRecipient.type}</div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto space-y-4 mb-4">
                {filteredMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                        msg.from === 'admin' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'admin' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(msg.at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex space-x-3">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

// --- DOCUMENTS COMPONENT -------------------------------------------------

const Documents = ({ drivers, owners }) => {
  const allWaybills = drivers.flatMap(driver => 
    driver.waybills.map(waybill => ({
      ...waybill,
      uploadedBy: driver.name,
      type: 'driver'
    }))
  ).concat(
    owners.flatMap(owner => 
      owner.waybills.map(waybill => ({
        ...waybill,
        uploadedBy: owner.name,
        type: 'owner'
      }))
    )
  );

  return (
    <div className="space-y-6">
      <Header title="Documents" />
      
      <Section title="All Waybills">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allWaybills.map(waybill => (
                <tr key={waybill.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{waybill.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {waybill.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(waybill.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
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

// --- USER MANAGEMENT COMPONENT -------------------------------------------

const UserManagement = ({ users, onSaveUser, onDeleteUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "driver",
    permissions: []
  });

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "driver", label: "Driver" },
    { value: "owner", label: "Client" }
  ];

  const permissionOptions = [
    { value: "read", label: "Read" },
    { value: "write", label: "Write" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
    { value: "all", label: "All Permissions" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      onSaveUser({ ...editingUser, ...formData });
    } else {
      onSaveUser(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingUser(null);
    setIsFormOpen(false);
    setFormData({
      username: "",
      password: "",
      name: "",
      role: "driver",
      permissions: []
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      name: user.name,
      role: user.role,
      permissions: user.permissions || []
    });
    setIsFormOpen(true);
  };

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="space-y-6">
      <Header 
        title="User Management" 
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        } 
      />

      {/* User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
              <Input
                label="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                label="Role"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                options={roleOptions}
              />

              {formData.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="space-y-2">
                    {permissionOptions.map(permission => (
                      <label key={permission.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={() => togglePermission(permission.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingUser ? 'Update' : 'Create'} User
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Section>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === "admin" ? "primary" : "secondary"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.permissions.join(", ") || "None"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="error" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Delete user ${user.name}?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

// --- SETTINGS COMPONENT --------------------------------------------------

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: "HeeyLogistics",
    email: "info@heeysomaliland.com",
    phone: "+252 63 123 4567",
    address: "Hargeisa, Somaliland",
    notifications: true,
    autoAssign: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <Header title="Settings" />
      
      <Section title="Company Information">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={settings.companyName}
              onChange={e => setSettings({ ...settings, companyName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={settings.phone}
              onChange={e => setSettings({ ...settings, phone: e.target.value })}
            />
            <Input
              label="Address"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Preferences</h4>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={e => setSettings({ ...settings, notifications: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoAssign"
                checked={settings.autoAssign}
                onChange={e => setSettings({ ...settings, autoAssign: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="autoAssign" className="text-sm text-gray-700">
                Auto-assign available drivers
              </label>
            </div>
          </div>
          
          <Button type="submit">Save Settings</Button>
        </form>
      </Section>
    </div>
  );
};

// --- ABOUT COMPONENT -----------------------------------------------------

const About = () => {
  return (
    <div className="space-y-6">
      <Header title="About HeeyLogistics" />
      
      <Section>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4">About Our System</h3>
          <p className="text-gray-600 mb-4">
            HeeyLogistics is a comprehensive fleet management and logistics solution designed 
            specifically for the Somaliland market. Our system helps businesses manage their 
            transportation operations efficiently.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="text-center">
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Fleet Management</h4>
              <p className="text-sm text-gray-600">Track and manage your entire fleet in real-time</p>
            </Card>
            
            <Card className="text-center">
              <User className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Driver Management</h4>
              <p className="text-sm text-gray-600">Manage driver assignments, status, and documents</p>
            </Card>
            
            <Card className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Analytics</h4>
              <p className="text-sm text-gray-600">Get insights into your logistics operations</p>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
};

// --- MAIN APP COMPONENT --------------------------------------------------

const App = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [users, setUsers] = useState(seedUsers);
  const [messages, setMessages] = useState(seedMessages);

  // Stats for dashboard
  const stats = [
    { label: "Total Drivers", value: drivers.length, change: 12, color: "bg-blue-500", icon: User },
    { label: "Active Clients", value: owners.length, change: 8, color: "bg-green-500", icon: Truck },
    { label: "Available Trucks", value: tracks.filter(t => t.isAvailable).length, change: -3, color: "bg-purple-500", icon: Car },
    { label: "Pending Waybills", value: drivers.flatMap(d => d.waybills).length + owners.flatMap(o => o.waybills).length, change: 5, color: "bg-yellow-500", icon: FileText }
  ];

  const recentActivities = [
    { title: "New Driver Registered", description: "Ahmed Ali joined the fleet", time: "2 hours ago", status: "Completed", statusVariant: "success", icon: User, bgColor: "bg-blue-100" },
    { title: "Waybill Uploaded", description: "Customs clearance document added", time: "4 hours ago", status: "Pending", statusVariant: "warning", icon: FileText, bgColor: "bg-yellow-100" },
    { title: "Truck Maintenance", description: "SL-TRK-4410 scheduled for service", time: "1 day ago", status: "Scheduled", statusVariant: "primary", icon: Car, bgColor: "bg-purple-100" }
  ];

  // Handler functions
  const handleUpdateDriverStatus = (driverId, newStatus) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, status: newStatus } : driver
    ));
  };

  const handleSaveDriver = (driverData) => {
    if (driverData.id) {
      setDrivers(drivers.map(d => d.id === driverData.id ? driverData : d));
    } else {
      const newDriver = {
        ...driverData,
        id: generateId(),
        waybills: [],
        rating: 0,
        assignedClientId: null
      };
      setDrivers([...drivers, newDriver]);
    }
  };

  const handleDeleteDriver = (driverId) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    setTracks(tracks.map(track => 
      track.assignedDriverId === driverId ? { ...track, assignedDriverId: null } : track
    ));
  };

  const handleSaveOwner = (ownerData) => {
    if (ownerData.id) {
      setOwners(owners.map(o => o.id === ownerData.id ? ownerData : o));
    } else {
      const newOwner = {
        ...ownerData,
        id: generateId(),
        waybills: [],
        assignedDrivers: [],
        rating: 0
      };
      setOwners([...owners, newOwner]);
    }
  };

  const handleDeleteOwner = (ownerId) => {
    setOwners(owners.filter(o => o.id !== ownerId));
    setDrivers(drivers.map(driver => 
      driver.assignedClientId === ownerId ? { ...driver, assignedClientId: null } : driver
    ));
  };

  const handleAssignDriver = (ownerId, driverId) => {
    setOwners(owners.map(owner => 
      owner.id === ownerId 
        ? { ...owner, assignedDrivers: [...(owner.assignedDrivers || []), driverId] }
        : owner
    ));
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, assignedClientId: ownerId } : driver
    ));
  };

  const handleUnassignDriver = (ownerId, driverId) => {
    setOwners(owners.map(owner => 
      owner.id === ownerId 
        ? { ...owner, assignedDrivers: owner.assignedDrivers.filter(id => id !== driverId) }
        : owner
    ));
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, assignedClientId: null } : driver
    ));
  };

  const handleRateDriver = (ownerId, driverId, rating) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, rating } : driver
    ));
  };

  const handleMarkArrived = (ownerId, driverId) => {
    alert(`Material arrived confirmed for driver ${driverId} at client ${ownerId}`);
    // Update driver status to completed
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, status: "purchaser-reached" } : driver
    ));
  };

  const handleUpdateAvailability = (trackId, isAvailable) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, isAvailable } : track
    ));
  };

  const handleAssignDriverToTrack = (trackId, driverId) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, assignedDriverId: driverId } : track
    ));
  };

  const handleSendMessage = (toId, text) => {
    const newMessage = {
      id: generateId(),
      from: "admin",
      toId,
      text,
      at: now()
    };
    setMessages([...messages, newMessage]);
  };

  const handleSaveUser = (userData) => {
    if (userData.id) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
    } else {
      const newUser = {
        ...userData,
        id: generateId()
      };
      setUsers([...users, newUser]);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  // Render current tab content
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard stats={stats} recentActivities={recentActivities} drivers={drivers} owners={owners} tracks={tracks} />;
      case "drivers":
        return <DriverManagement 
          drivers={drivers} 
          onUpdateStatus={handleUpdateDriverStatus}
          onSaveDriver={handleSaveDriver}
          onDeleteDriver={handleDeleteDriver}
        />;
      case "owners":
        return <ClientManagement 
          owners={owners}
          drivers={drivers}
          onSaveOwner={handleSaveOwner}
          onDeleteOwner={handleDeleteOwner}
          onAssignDriver={handleAssignDriver}
          onUnassignDriver={handleUnassignDriver}
          onRateDriver={handleRateDriver}
          onMarkArrived={handleMarkArrived}
        />;
      case "fleet":
        return <FleetTracking 
          tracks={tracks}
          drivers={drivers}
          onUpdateAvailability={handleUpdateAvailability}
          onAssignDriver={handleAssignDriverToTrack}
        />;
      case "messages":
        return <Messages 
          messages={messages}
          onSendMessage={handleSendMessage}
          drivers={drivers}
          owners={owners}
        />;
      case "documents":
        return <Documents drivers={drivers} owners={owners} />;
      case "user-management":
        return <UserManagement 
          users={users}
          onSaveUser={handleSaveUser}
          onDeleteUser={handleDeleteUser}
        />;
      case "settings":
        return <Settings />;
      case "about":
        return <About />;
      default:
        return <Dashboard stats={stats} recentActivities={recentActivities} drivers={drivers} owners={owners} tracks={tracks} />;
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