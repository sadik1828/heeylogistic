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
  MoreVertical
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
  },
];

const seedOwners = [
  { 
    id: SEED_OWNER_ID, 
    name: "Abdi Buyer Co.", 
    location: "Hargeisa Market", 
    phone: "+25263 600 1010", 
    waybills: [],
    email: "abdi@buyerco.com",
    contactPerson: "Abdi Hassan"
  },
  { 
    id: "o2", 
    name: "Zahra Import Export", 
    location: "Borama Trade Center", 
    phone: "+25263 600 2020", 
    waybills: [],
    email: "info@zahraimport.com",
    contactPerson: "Zahra Mohamed"
  },
  { 
    id: "o3", 
    name: "Somaliland Goods Ltd.", 
    location: "Hargeisa Industrial Zone", 
    phone: "+25263 600 3030", 
    waybills: [],
    email: "orders@somalilandgoods.com",
    contactPerson: "Mohamed Ahmed"
  },
];

const seedTracks = [
  { id: SEED_TRACK_ID, plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, carOwnerId: SEED_CAR_OWNER_ID, assignedDriverId: SEED_DRIVER_ID },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: false, carOwnerId: "co2", assignedDriverId: "d2" },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2" },
  { id: "t4", plate: "SL-TRK-1050", model: "Mercedes Actros", isAvailable: false, carOwnerId: "co3", assignedDriverId: "d3" },
];

const seedUsers = [
    { id: 'u1', username: 'admin', password: 'password123', role: 'admin', name: 'System Administrator' },
    { id: 'u2', username: 'ahmed_ali', password: 'driver123', role: 'driver', name: 'Ahmed Ali' },
    { id: 'u3', username: 'abdi_buyer', password: 'owner123', role: 'owner', name: 'Abdi Hassan' },
];

const seedMessages = [
    { id: "m1", from: "owner", toId: SEED_DRIVER_ID, text: "Driver on the way to customs?", at: now() },
    { id: "m2", from: "driver", toId: "u1", text: "Yes, 10 minutes out from customs.", at: now() },
    { id: "m3", from: "admin", toId: "o2", text: "Zahra, please check your waybill upload.", at: now() },
];

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

const Input = ({ label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input 
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

// --- SIDEBAR COMPONENT ----------------------------------------------------

const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "drivers", label: "Driver Management", icon: User },
    { id: "owners", label: "Client Management", icon: Truck },
    { id: "fleet", label: "Fleet Tracking", icon: Car },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Settings", icon: SettingsIcon },
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
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENT -------------------------------------------------

const Dashboard = ({ stats, recentActivities }) => {
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

const DriverManagement = ({ drivers, onUpdateStatus }) => {
  const statusOptions = [
    { value: "idle", label: "Idle", color: "gray" },
    { value: "loading", label: "Loading", color: "yellow" },
    { value: "in-transit", label: "In Transit", color: "blue" },
    { value: "custom-reached", label: "Customs Reached", color: "purple" },
    { value: "unloading", label: "Unloading", color: "red" },
    { value: "purchaser-reached", label: "Purchaser Reached", color: "green" }
  ];

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "gray";
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Driver Management" 
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Driver
          </Button>
        } 
      />
      
      <Section>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
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
                        <div className="text-sm text-gray-500">{driver.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.truckNumber}</div>
                    <div className="text-sm text-gray-500">{driver.co_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(driver.status)}>{driver.status.replace('-', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Select
                      value={driver.status}
                      onChange={(e) => onUpdateStatus(driver.id, e.target.value)}
                      options={statusOptions}
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
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

const ClientManagement = ({ owners, onSaveOwner, onDeleteOwner }) => {
  const [editingOwner, setEditingOwner] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      onSaveOwner(formData);
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
              </div>
              <Badge variant="primary">{owner.waybills.length} waybills</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
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
            
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => handleEdit(owner)} className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="error" 
                size="sm"
                onClick={() => {
                  if (window.confirm(`Delete ${owner.name}?`)) {
                    onDeleteOwner(owner.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- FLEET TRACKING COMPONENT -------------------------------------------

const FleetTracking = ({ tracks, onToggleAvailability }) => {
  return (
    <div className="space-y-6">
      <Header title="Fleet Tracking" />
      
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(track => (
            <Card key={track.id} className="relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{track.plate}</h3>
                  <p className="text-gray-600">{track.model}</p>
                </div>
                <Badge variant={track.isAvailable ? "success" : "error"}>
                  {track.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">
                    {track.assignedDriverId ? "Assigned" : "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-medium">{track.carOwnerId ? "Registered" : "Unknown"}</span>
                </div>
              </div>
              
              <Button 
                variant={track.isAvailable ? "error" : "success"}
                onClick={() => onToggleAvailability(track.id)}
                className="w-full"
              >
                {track.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </Button>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
};

// --- MESSAGES COMPONENT -------------------------------------------------

const Messages = ({ messages, onSendMessage, drivers, owners }) => {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const allRecipients = [
    ...drivers.map(d => ({ ...d, type: 'driver' })),
    ...owners.map(o => ({ ...o, type: 'owner' }))
  ];

  const filteredMessages = messages.filter(msg => 
    selectedRecipient && 
    ((msg.from === 'admin' && msg.toId === selectedRecipient.id) || 
     (msg.from !== 'admin' && msg.toId === 'u1' && msg.from === selectedRecipient.type))
  );

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRecipient) return;
    
    onSendMessage({
      id: generateId(),
      from: 'admin',
      toId: selectedRecipient.id,
      text: newMessage.trim(),
      at: now()
    });
    
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <Header title="Messages" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipients List */}
        <Section className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-4">Contacts</h3>
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
                <div className="font-medium text-gray-900">{recipient.name}</div>
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
                  <div className="font-semibold text-gray-900">{selectedRecipient.name}</div>
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

              <div className="flex space-x-3">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
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

// --- DOCUMENTS COMPONENT ------------------------------------------------

const Documents = () => {
  const documentCategories = [
    { name: "Waybills", count: 24, icon: FileText, color: "blue" },
    { name: "Contracts", count: 8, icon: FileText, color: "green" },
    { name: "Licenses", count: 12, icon: FileText, color: "purple" },
    { name: "Insurance", count: 6, icon: FileText, color: "yellow" },
  ];

  const recentDocuments = [
    { name: "Waybill_2024_003.pdf", date: "2024-01-15", size: "2.4 MB", type: "Waybill" },
    { name: "Driver_Contract_Ali.pdf", date: "2024-01-14", size: "1.8 MB", type: "Contract" },
    { name: "Insurance_Renewal.pdf", date: "2024-01-12", size: "3.2 MB", type: "Insurance" },
    { name: "Vehicle_License_9921.pdf", date: "2024-01-10", size: "1.5 MB", type: "License" },
  ];

  return (
    <div className="space-y-6">
      <Header 
        title="Documents" 
        actions={
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        } 
      />

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentCategories.map(category => {
          const Icon = category.icon;
          return (
            <Card key={category.name} className="text-center">
              <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 text-${category.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{category.count}</h3>
              <p className="text-gray-600">{category.name}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Documents */}
      <Section title="Recent Documents">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDocuments.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary">{doc.type}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.size}
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

// --- SETTINGS COMPONENT -------------------------------------------------

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <Header title="Settings" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <Input label="Full Name" defaultValue="Admin User" />
            <Input label="Email" type="email" defaultValue="admin@heeylogistics.com" />
            <Input label="Phone" defaultValue="+25263 123 4567" />
            <Button>Save Changes</Button>
          </div>
        </Section>
        
        <Section>
          <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT -------------------------------------------------

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [messages, setMessages] = useState(seedMessages);
  const [users, setUsers] = useState(seedUsers);

  // Stats for dashboard
  const stats = [
    { 
      label: "Total Vehicles", 
      value: tracks.length, 
      change: 12, 
      icon: Car,
      color: "bg-blue-500"
    },
    { 
      label: "Active Drivers", 
      value: drivers.filter(d => d.status !== 'idle').length, 
      change: 5, 
      icon: User,
      color: "bg-green-500"
    },
    { 
      label: "Clients", 
      value: owners.length, 
      change: 8, 
      icon: Truck,
      color: "bg-purple-500"
    },
    { 
      label: "Available Vehicles", 
      value: tracks.filter(t => t.isAvailable).length, 
      change: -2, 
      icon: CheckCircle,
      color: "bg-yellow-500"
    },
  ];

  const recentActivities = [
    {
      title: "New Driver Registered",
      description: "Ahmed Ali joined the fleet",
      time: "2 hours ago",
      status: "Completed",
      statusVariant: "success",
      icon: User,
      bgColor: "bg-green-100"
    },
    {
      title: "Waybill Uploaded",
      description: "Customs clearance document added",
      time: "5 hours ago",
      status: "Pending",
      statusVariant: "warning",
      icon: FileText,
      bgColor: "bg-blue-100"
    },
    {
      title: "Vehicle Maintenance",
      description: "SL-TRK-4410 scheduled for service",
      time: "1 day ago",
      status: "Scheduled",
      statusVariant: "primary",
      icon: Car,
      bgColor: "bg-yellow-100"
    }
  ];

  // Handler functions
  const handleUpdateDriverStatus = (driverId, newStatus) => {
    setDrivers(drivers.map(d => 
      d.id === driverId ? { ...d, status: newStatus } : d
    ));
  };

  const handleSaveOwner = (ownerData) => {
    if (ownerData.id) {
      // Update existing owner
      setOwners(owners.map(o => 
        o.id === ownerData.id ? { ...o, ...ownerData } : o
      ));
    } else {
      // Add new owner
      const newOwner = {
        id: generateId(),
        waybills: [],
        ...ownerData
      };
      setOwners([...owners, newOwner]);
    }
  };

  const handleDeleteOwner = (ownerId) => {
    setOwners(owners.filter(o => o.id !== ownerId));
  };

  const handleToggleAvailability = (trackId) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, isAvailable: !t.isAvailable } : t
    ));
  };

  const handleSendMessage = (message) => {
    setMessages([...messages, message]);
  };

  // Render current tab content
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard stats={stats} recentActivities={recentActivities} />;
      case "drivers":
        return <DriverManagement 
          drivers={drivers} 
          onUpdateStatus={handleUpdateDriverStatus} 
        />;
      case "owners":
        return <ClientManagement 
          owners={owners} 
          onSaveOwner={handleSaveOwner} 
          onDeleteOwner={handleDeleteOwner} 
        />;
      case "fleet":
        return <FleetTracking 
          tracks={tracks} 
          onToggleAvailability={handleToggleAvailability} 
        />;
      case "messages":
        return <Messages 
          messages={messages} 
          onSendMessage={handleSendMessage}
          drivers={drivers}
          owners={owners}
        />;
      case "documents":
        return <Documents />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <Dashboard stats={stats} recentActivities={recentActivities} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}