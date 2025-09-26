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
  Link2,
} from "lucide-react";

// --- DATA STRUCTURES ----------------------------------------------------
const now = () => new Date().toISOString();
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const SEED_CAR_OWNER_ID = "co1";
const SEED_DRIVER_ID = "d1";
const SEED_OWNER_ID = "o1";
const SEED_TRACK_ID = "t1";

// New structure for drivers, includes nested Car Owner details and Rating
const seedDrivers = [
  {
    id: SEED_DRIVER_ID,
    name: "Ahmed Ali",
    address: "Hargeisa, Togdheer Rd",
    phone: "+25263 555 1122",
    status: "in-transit", // Driver status
    truckNumber: "SL-TRK-9921",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    driverLicenseUrl: "#", // Driver license upload/view
    waybills: [{ id: "w1", name: "Customs Clearance.pdf", uploadedAt: now(), fileUrl: "#" }],
    // New Car Owner details part of driver registration
    carOwner: {
        id: SEED_CAR_OWNER_ID,
        name: "Mahad Transport Co.",
        phone: "+25263 500 1111",
        photoUrl: "https://placehold.co/150x150/34D399/fff?text=CO", // Owner photo
        ownershipDocUrl: "#", // Ownership car document upload/view
    },
    rating: 4.5, // New rating field
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    phone: "+25263 777 9010",
    status: "idle",
    truckNumber: "SL-TRK-4410",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    driverLicenseUrl: "#",
    waybills: [{ id: "w2", name: "Waybill-INV-009.pdf", uploadedAt: now(), fileUrl: "#" }],
    carOwner: {
        id: "co2",
        name: "Sahal Logistics",
        phone: "+25263 500 2222",
        photoUrl: "https://placehold.co/150x150/60A5FA/fff?text=SL",
        ownershipDocUrl: "#",
    },
    rating: 4.8,
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
    carOwner: {
        id: "co3",
        name: "Geeska Transport",
        phone: "+25263 500 3333",
        photoUrl: "https://placehold.co/150x150/FBBF24/fff?text=GT",
        ownershipDocUrl: "#",
    },
    rating: 4.1,
  },
];

// New structure for owners/clients, includes assigned driver, material status, and waybills
const seedOwners = [
  { 
    id: SEED_OWNER_ID, 
    name: "Abdi Buyer Co.", 
    location: "Hargeisa Market", 
    phone: "+25263 600 1010", 
    email: "abdi@buyerco.com",
    contactPerson: "Abdi Hassan",
    assignedDriverId: SEED_DRIVER_ID, // Assigned driver ID
    materialArrived: false, // Material arrival status
    clientWaybills: [{ name: "Order_001.pdf", url: "#" }], // Client's own waybill uploads
  },
  { 
    id: "o2", 
    name: "Zahra Import Export", 
    location: "Borama Trade Center", 
    phone: "+25263 600 2020", 
    email: "info@zahraimport.com",
    contactPerson: "Zahra Mohamed",
    assignedDriverId: null, // No assigned driver
    materialArrived: false,
    clientWaybills: [],
  },
  { 
    id: "o3", 
    name: "Somaliland Goods Ltd.", 
    location: "Hargeisa Industrial Zone", 
    phone: "+25263 600 3030", 
    email: "orders@somalilandgoods.com",
    contactPerson: "Mohamed Ahmed",
    assignedDriverId: "d3",
    materialArrived: true,
    clientWaybills: [{ name: "Order_003.pdf", url: "#" }],
  },
];

const seedTracks = [
  { id: SEED_TRACK_ID, plate: "SL-TRK-9921", model: "Hino 500", isAvailable: false, carOwnerId: SEED_CAR_OWNER_ID, assignedDriverId: SEED_DRIVER_ID },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: true, carOwnerId: "co2", assignedDriverId: null },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2", assignedDriverId: null },
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
    { id: "m3", from: "admin", toId: SEED_OWNER_ID, text: "Abdi, your material is near the destination.", at: now() },
];

// --- STYLED COMPONENTS (Shared Components) ----------------------------------------------------

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
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, className = "", ...props }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const Select = ({ label, options, className="", ...props }) => (
  <div className={`space-y-1 ${className}`}>
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

// Custom Modal Component (simple)
const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
};

// --- SIDEBAR COMPONENT ----------------------------------------------------
const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "drivers", label: "Driver Management", icon: User },
    { id: "owners", label: "Client Management", icon: Truck },
    { id: "fleet", label: "Fleet Tracking", icon: Car },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "admin", label: "Admin Tools", icon: SettingsIcon }, // Renamed to Admin Tools
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
        {actions}
      </div>
    </div>
  );
};

// --- DRIVER MANAGEMENT COMPONENT (Admin View) -----------------------------------------

const DRIVER_STATUS_OPTIONS = [
  { value: "idle", label: "Idle", color: "gray" },
  { value: "loaded", label: "Loaded", color: "yellow" },
  { value: "in-transit", label: "In Transit", color: "blue" },
  { value: "custom-reached", label: "Customs Reached", color: "purple" },
  { value: "purchaser-reached", label: "Purchaser Reached", color: "green" }
];

const DriverRegistrationForm = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialData || {
    id: generateId(),
    name: "", address: "", phone: "", photoUrl: "https://placehold.co/150x150/000/fff?text=D",
    truckNumber: "", driverLicenseUrl: "#", status: "idle", rating: 5.0, waybills: [],
    carOwner: { name: "", phone: "", photoUrl: "https://placehold.co/150x150/000/fff?text=CO", ownershipDocUrl: "#" }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('owner_')) {
      setFormData(prev => ({
        ...prev,
        carOwner: { ...prev.carOwner, [name.replace('owner_', '')]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Mocking file upload inputs with simple text/URL inputs
  const FileInput = ({ label, name, value, onChange }) => (
    <Input
      label={`${label} (URL/Link Placeholder)`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()} link`}
    />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-bold text-blue-600">Driver Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} required className="col-span-2" />
        <Input label="Truck Number" name="truckNumber" value={formData.truckNumber} onChange={handleChange} required />
        <Select 
            label="Initial Status" 
            name="status"
            value={formData.status} 
            onChange={handleChange}
            options={DRIVER_STATUS_OPTIONS}
        />
        <FileInput 
          label="Driver Photo" 
          name="photoUrl" 
          value={formData.photoUrl} 
          onChange={handleChange} 
        />
        <FileInput 
          label="Driver License" 
          name="driverLicenseUrl" 
          value={formData.driverLicenseUrl} 
          onChange={handleChange} 
        />
      </div>

      <h3 className="text-lg font-bold text-blue-600 border-t pt-4">Car Owner Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Owner Name" name="owner_name" value={formData.carOwner.name} onChange={handleChange} required />
        <Input label="Owner Phone" name="owner_phone" type="tel" value={formData.carOwner.phone} onChange={handleChange} required />
        <FileInput 
          label="Owner Photo" 
          name="owner_photoUrl" 
          value={formData.carOwner.photoUrl} 
          onChange={handleChange} 
        />
        <FileInput 
          label="Ownership Document" 
          name="owner_ownershipDocUrl" 
          value={formData.carOwner.ownershipDocUrl} 
          onChange={handleChange} 
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Driver' : 'Register Driver'}
        </Button>
      </div>
    </form>
  );
};


const DriverManagement = ({ drivers, onUpdateDriver, onDeleteDriver, onSaveDriver }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const getStatusColor = (status) => {
    const option = DRIVER_STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.color : "gray";
  };
  
  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const handleOpenNew = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  }

  const handleCloseForm = () => {
    setEditingDriver(null);
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <Header 
        title="Driver Management" 
        actions={
          <Button onClick={handleOpenNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Driver
          </Button>
        } 
      />
      
      <Modal 
        title={editingDriver ? "Edit Driver Registration" : "New Driver Registration"}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      >
        <DriverRegistrationForm 
          initialData={editingDriver}
          onSave={onSaveDriver}
          onClose={handleCloseForm}
        />
      </Modal>

      <Section>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver/Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle/Owner Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Driver Update)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions (Admin)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map(driver => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  {/* Driver Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={driver.photoUrl} alt={driver.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-xs text-gray-500">{driver.address} | {driver.phone}</div>
                      </div>
                    </div>
                  </td>
                  {/* Vehicle/Owner Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.truckNumber}</div>
                    <div className="text-xs text-gray-500">{driver.carOwner.name} ({driver.carOwner.phone})</div>
                  </td>
                  {/* Rating */}
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">{driver.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  {/* Status (Driver action simulation) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={driver.status}
                      onChange={(e) => onUpdateDriver(driver.id, e.target.value)}
                      options={DRIVER_STATUS_OPTIONS.map(o => ({
                        value: o.value, 
                        label: o.label,
                      }))}
                      className="!p-0 !py-0 !m-0 !w-40"
                    />
                    <Badge variant={getStatusColor(driver.status)} className="mt-1">{driver.status.replace('-', ' ')}</Badge>
                  </td>
                  {/* Documents (Upload and View) */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    <div className="space-y-1">
                      <a href={driver.driverLicenseUrl} target="_blank" className="text-blue-600 hover:underline flex items-center">
                        <Link2 className="w-3 h-3 mr-1" />License (View/Upload)
                      </a>
                      <a href={driver.carOwner.ownershipDocUrl} target="_blank" className="text-blue-600 hover:underline flex items-center">
                        <Link2 className="w-3 h-3 mr-1" />Owner Doc (View/Upload)
                      </a>
                      <a href={driver.waybills[0]?.fileUrl || '#'} target="_blank" className="text-blue-600 hover:underline flex items-center">
                        <Link2 className="w-3 h-3 mr-1" />Waybill ({driver.waybills.length} Total)
                      </a>
                    </div>
                  </td>
                  {/* Admin Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="error" size="sm" onClick={() => onDeleteDriver(driver.id)}>
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

const ClientManagement = ({ owners, drivers, tracks, onSaveOwner, onDeleteOwner, onAssignDriver, onUnassignDriver, onApproveMaterial, onRateDriver, onOpenChat }) => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "", phone: "" });

  const availableDrivers = useMemo(() => {
    // Only drivers who are not currently assigned to a track or another client
    const assignedDriverIds = tracks.filter(t => t.assignedDriverId).map(t => t.assignedDriverId);
    return drivers.filter(d => !assignedDriverIds.includes(d.id) || tracks.find(t => t.assignedDriverId === d.id)?.isAvailable);
  }, [drivers, tracks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      onSaveOwner({ ...editingClient, ...formData });
    } else {
      onSaveOwner(formData);
    }
    setEditingClient(null);
    setIsClientFormOpen(false);
    setFormData({ name: "", location: "", phone: "" });
  };

  const handleEdit = (owner) => {
    setEditingClient(owner);
    setFormData({
      name: owner.name,
      location: owner.location,
      phone: owner.phone
    });
    setIsClientFormOpen(true);
  };
  
  const handleAssign = (ownerId, driverId) => {
    const assignedDriver = drivers.find(d => d.id === driverId);
    if (assignedDriver) {
        // Find the track associated with the driver and mark it unavailable for others
        const associatedTrack = tracks.find(t => t.assignedDriverId === driverId);
        if (associatedTrack) {
            // In a real app, this would update the track state too
        }
    }
    onAssignDriver(ownerId, driverId);
  }

  const handleRate = (ownerId, driverId) => {
    const newRating = prompt("Enter new rating for driver (1.0 to 5.0):");
    if (newRating && parseFloat(newRating) >= 1 && parseFloat(newRating) <= 5) {
      onRateDriver(driverId, parseFloat(newRating));
    }
  }


  return (
    <div className="space-y-6">
      <Header 
        title="Client Management" 
        actions={
          <Button onClick={() => { setEditingClient(null); setIsClientFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Client
          </Button>
        } 
      />

      {/* Client Form Modal */}
      <Modal
        title={editingClient ? "Edit Client Details" : "Create New Client"}
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsClientFormOpen(false)}>Cancel</Button>
            <Button type="submit">{editingClient ? 'Update Client' : 'Create Client'}</Button>
          </div>
        </form>
      </Modal>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {owners.map(owner => {
          const assignedDriver = drivers.find(d => d.id === owner.assignedDriverId);
          const driverStatus = assignedDriver ? DRIVER_STATUS_OPTIONS.find(o => o.value === assignedDriver.status) : null;

          return (
            <Card key={owner.id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{owner.name}</h3>
                    <p className="text-sm text-gray-600">{owner.location}</p>
                  </div>
                  <Badge variant={owner.materialArrived ? "success" : "warning"}>
                    {owner.materialArrived ? "Material Approved" : "Pending Arrival"}
                  </Badge>
                </div>
                
                {/* Assigned Driver Details / Assignment */}
                <div className="p-3 mb-4 rounded-lg border border-dashed border-gray-200">
                  {assignedDriver ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-blue-600">Assigned Driver</h4>
                      <div className="flex items-center text-sm">
                        <img className="w-8 h-8 rounded-full object-cover mr-2" src={assignedDriver.photoUrl} alt={assignedDriver.name} />
                        <div>
                          <p className="font-medium text-gray-900">{assignedDriver.name}</p>
                          <p className="text-xs text-gray-500">{assignedDriver.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{assignedDriver.rating.toFixed(1)}</span>
                        <Badge variant={driverStatus?.color || "default"} className="ml-3">
                           {driverStatus?.label || 'No Status'}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <Select
                      label="Assign Driver/Track"
                      options={[
                        { value: "", label: "--- Select Available Driver ---" },
                        ...availableDrivers.map(d => ({ value: d.id, label: `${d.name} (${d.truckNumber})` }))
                      ]}
                      onChange={(e) => handleAssign(owner.id, e.target.value)}
                      className="!p-0 !py-0 !m-0"
                    />
                  )}
                </div>

                {/* Waybills (Client upload/view) */}
                <div className="flex justify-between items-center text-sm py-2 border-t border-gray-100">
                    <span className="text-gray-600">Client Waybills:</span>
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                        <Link2 className="w-4 h-4 mr-1" />
                        Upload/View ({owner.clientWaybills.length})
                    </a>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {assignedDriver && (
                  <>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => onRateDriver(owner.id, assignedDriver.id)} 
                      className="flex-1 min-w-[48%]"
                    >
                      <Star className="w-4 h-4 mr-1" />Rate
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => onOpenChat(assignedDriver)} 
                      className="flex-1 min-w-[48%]"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />Message
                    </Button>
                    <Button 
                      variant="error" 
                      size="sm" 
                      onClick={() => onUnassignDriver(owner.id)} 
                      className="flex-1 min-w-[48%]"
                    >
                      <Truck className="w-4 h-4 mr-1" />Unassign
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={() => onApproveMaterial(owner.id)} 
                      disabled={owner.materialArrived || driverStatus?.value !== 'purchaser-reached'}
                      className="flex-1 min-w-[48%]"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />Arrived
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => handleEdit(owner)} className="flex-1 min-w-[48%]">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="error" size="sm" onClick={() => onDeleteOwner(owner.id)} className="flex-1 min-w-[48%]">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// --- FLEET TRACKING COMPONENT -------------------------------------------

const FleetTracking = ({ tracks, drivers, onToggleAvailability }) => {
  const availableTracks = tracks.filter(t => t.isAvailable);
  
  return (
    <div className="space-y-6">
      <Header title="Available Tracks" /> 
      
      <Section title={`Fleet Status - Admin Management (${tracks.length} Total Vehicles)`}>
         <p className="text-gray-600 mb-4">Admin can manage availability status of all tracks here.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map(track => {
             const driver = drivers.find(d => d.id === track.assignedDriverId);
             const isAvailableForNewAssignment = track.isAvailable && !track.assignedDriverId;

             return (
                 <Card key={track.id} className={`relative transition-all ${isAvailableForNewAssignment ? 'border-green-400 border-2' : ''}`}>
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
                      <span className={`font-medium text-sm ${driver ? 'text-blue-600' : 'text-gray-500'}`}>
                        {driver ? driver.name : "Unassigned"}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant={track.isAvailable ? "error" : "success"}
                    onClick={() => onToggleAvailability(track.id)}
                    className="w-full"
                  >
                    Mark {track.isAvailable ? "Unavailable" : "Available"}
                  </Button>
                </Card>
             );
          })}
        </div>
      </Section>
    </div>
  );
};

// --- MESSAGES COMPONENT (Chat) ------------------------------------------

const Messages = ({ messages, onSendMessage, drivers, owners, initialRecipient }) => {
  const [selectedRecipient, setSelectedRecipient] = useState(initialRecipient);
  const [newMessage, setNewMessage] = useState("");

  // Update selectedRecipient if initialRecipient changes (e.g., coming from ClientManagement)
  React.useEffect(() => {
    if (initialRecipient) {
      setSelectedRecipient(initialRecipient);
    }
  }, [initialRecipient]);


  const allRecipients = useMemo(() => ([
    ...drivers.map(d => ({ ...d, type: 'driver' })),
    ...owners.map(o => ({ ...o, type: 'owner' }))
  ]), [drivers, owners]);

  const filteredMessages = messages.filter(msg => {
    if (!selectedRecipient) return false;
    
    // Simulate chat: Admin chats with any user using their IDs
    return (msg.toId === selectedRecipient.id) || (msg.fromId === selectedRecipient.id);
  });

  const handleSend = () => {
    if (!newMessage.trim() || !selectedRecipient) return;
    
    // Simulate Admin sending a message to a recipient
    onSendMessage({
      id: generateId(),
      from: 'admin',
      fromId: 'u1', // Admin User ID
      to: selectedRecipient.type,
      toId: selectedRecipient.id,
      text: newMessage.trim(),
      at: now()
    });
    
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <Header title="Chat (Admin, Driver, and Owner)" />
      
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
        <Section className="lg:col-span-2 flex flex-col h-[600px]">
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

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                {filteredMessages.length === 0 && <p className="text-center text-gray-400">No messages yet.</p>}
                {filteredMessages.map(msg => {
                    const isAdmin = msg.from === 'admin';
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow-md ${
                                    isAdmin 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${isAdmin ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {new Date(msg.at).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
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
            <div className="text-center py-12 text-gray-500 flex-1 flex flex-col justify-center items-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

// --- ADMIN USER CREATION / ROLES (Replaces SettingsPanel) -----------------

const AdminRoleAndAppManagement = ({ onSaveUser }) => {
    const [formData, setFormData] = useState({ 
      name: "", username: "", role: "admin", password: "", 
    });
    
    const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

    const handleCreateUser = (e) => {
      e.preventDefault();
      onSaveUser(formData);
      setFormData({ name: "", username: "", role: "admin", password: "" });
      setIsRoleFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <Header title="Admin Tools & User Creation" />
            
            <Section title="User & Role Management (Admin, Driver, Client Creation)">
              <p className="text-gray-600 mb-4">Use this panel to create new system users (Admin, Driver, Client). Driver and Client profiles should primarily be created via their respective management tabs for complex profile completion.</p>
              
              <Button onClick={() => setIsRoleFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New User Account
              </Button>
            </Section>

            {/* Admin/User Creation Modal */}
            <Modal
              title="Create New System User"
              isOpen={isRoleFormOpen}
              onClose={() => setIsRoleFormOpen(false)}
            >
              <form onSubmit={handleCreateUser} className="space-y-4">
                  <Select
                      label="User Role"
                      options={[
                          { value: "admin", label: "Admin" },
                          { value: "driver", label: "Driver (Basic Account)" },
                          { value: "owner", label: "Client (Basic Account)" },
                      ]}
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                  />
                  <Input label="Full Name" name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  <Input label="Username" name="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                  <Input label="Password" name="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

                  <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="secondary" onClick={() => setIsRoleFormOpen(false)}>Cancel</Button>
                      <Button type="submit">Create Account</Button>
                  </div>
              </form>
            </Modal>

            <Section title="System Permissions & Settings">
                <p className="text-gray-700">Manage global system settings and security permissions for different user roles here.</p>
            </Section>
        </div>
    );
};


// --- DASHBOARD AND ABOUT (Unchanged) ------------------------------------

const Dashboard = ({ stats, recentActivities }) => { /* ... existing Dashboard implementation ... */ return (
    <div className="space-y-6">
      <Header title="Dashboard Overview" />
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
const About = () => { /* ... existing About implementation ... */ return (
    <div className="space-y-6">
      <Header title="About HeeyLogistics" />
      
      <Section title="Our Vision">
        <p className="text-gray-700">
          HeeyLogistics is dedicated to providing efficient, reliable, and transparent logistics solutions across the region. We leverage technology to connect drivers, vehicle owners, and clients, ensuring smooth and timely transportation of goods.
        </p>
      </Section>
      
      <Section title="Contact Us">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Reach our Customer Support:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email (General)</p>
                  <a href="mailto:info@heeylogistic.com" className="text-sm text-blue-600 hover:underline">info@heeylogistic.com</a>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email (Support)</p>
                  <a href="mailto:support@heeylogistic.com" className="text-sm text-blue-600 hover:underline">support@heeylogistic.com</a>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone (Main)</p>
                  <span className="text-sm text-gray-700">+251 15151601</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone (Mobile)</p>
                  <span className="text-sm text-gray-700">+251 991927628</span>
                </div>
              </div>
            </Card>
          </div>
          
          <h4 className="font-semibold text-gray-900 mt-6">Office Location:</h4>
          <Card>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Headquarters</p>
                <p className="text-sm text-gray-700">Addis Ababa, near Daralasam Hotel, Ethiopia</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>
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
  const [chatRecipient, setChatRecipient] = useState(null);

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
      title: "New Client Added",
      description: "Somaliland Goods Ltd. registered",
      time: "2 hours ago",
      status: "Completed",
      statusVariant: "success",
      icon: Truck,
      bgColor: "bg-green-100"
    },
    {
      title: "Material Approved",
      description: "Abdi Buyer Co. confirmed arrival",
      time: "5 hours ago",
      status: "Finalized",
      statusVariant: "primary",
      icon: CheckCircle,
      bgColor: "bg-blue-100"
    },
    {
      title: "Driver Rating Updated",
      description: "Ahmed Ali received a 5-star rating",
      time: "1 day ago",
      status: "Completed",
      statusVariant: "warning",
      icon: Star,
      bgColor: "bg-yellow-100"
    }
  ];

  // --- Admin CRUD Handlers ---

  // Admin: create driver
  const handleSaveDriver = (driverData) => {
    if (drivers.find(d => d.id === driverData.id)) {
        // Update existing driver
        setDrivers(drivers.map(d => 
          d.id === driverData.id ? { ...d, ...driverData } : d
        ));
    } else {
        // Add new driver (auto-assigns a unique ID if not present, though form provides one)
        const newDriver = { ...driverData, id: driverData.id || generateId() };
        setDrivers([...drivers, newDriver]);
        
        // Also create a basic track for the new vehicle
        setTracks(prevTracks => [...prevTracks, {
            id: generateId(), 
            plate: newDriver.truckNumber, 
            model: "New Truck Model", // Placeholder
            isAvailable: true, 
            carOwnerId: newDriver.carOwner.id, 
            assignedDriverId: newDriver.id 
        }]);
    }
  };

  // Admin: update/delete driver status (used in DriverManagement)
  const handleUpdateDriverStatus = (driverId, newStatus) => {
    setDrivers(drivers.map(d => 
      d.id === driverId ? { ...d, status: newStatus } : d
    ));
  };
  const handleDeleteDriver = (driverId) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    // Also remove any assigned tracks (real app would unassign first)
    setTracks(tracks.filter(t => t.assignedDriverId !== driverId));
  };

  // Admin: create/update/delete client
  const handleSaveOwner = (ownerData) => {
    if (ownerData.id && owners.find(o => o.id === ownerData.id)) {
      setOwners(owners.map(o => 
        o.id === ownerData.id ? { ...o, ...ownerData } : o
      ));
    } else {
      const newOwner = {
        id: generateId(),
        assignedDriverId: null,
        materialArrived: false,
        clientWaybills: [],
        ...ownerData
      };
      setOwners([...owners, newOwner]);
    }
  };
  const handleDeleteOwner = (ownerId) => {
    setOwners(owners.filter(o => o.id !== ownerId));
  };

  // Admin: manage fleet tracking availability status
  const handleToggleAvailability = (trackId) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, isAvailable: !t.isAvailable } : t
    ));
  };

  // Admin: create user role
  const handleSaveUser = (userData) => {
    const newUser = { ...userData, id: generateId() };
    setUsers([...users, newUser]);
  };

  // --- Client Management Specific Handlers ---

  const handleAssignDriver = (ownerId, driverId) => {
    setOwners(owners.map(o => 
        o.id === ownerId ? { ...o, assignedDriverId: driverId } : o
    ));
    // Set the assigned track to unavailable (or assigned status)
    setTracks(tracks.map(t => 
        t.assignedDriverId === driverId ? { ...t, isAvailable: false } : t
    ));
  };

  const handleUnassignDriver = (ownerId) => {
    const owner = owners.find(o => o.id === ownerId);
    if (!owner) return;
    
    // Set the track associated with the driver back to available
    setTracks(tracks.map(t => 
        t.assignedDriverId === owner.assignedDriverId ? { ...t, isAvailable: true, assignedDriverId: null } : t
    ));

    setOwners(owners.map(o => 
        o.id === ownerId ? { ...o, assignedDriverId: null } : o
    ));
  };

  const handleApproveMaterial = (ownerId) => {
    setOwners(owners.map(o => 
        o.id === ownerId ? { ...o, materialArrived: true } : o
    ));
  };

  const handleRateDriver = (ownerId, driverId) => {
    const newRating = prompt("Enter new rating (1.0 - 5.0):");
    if (newRating && parseFloat(newRating) >= 1 && parseFloat(newRating) <= 5) {
        setDrivers(drivers.map(d => 
            d.id === driverId ? { ...d, rating: parseFloat(newRating) } : d
        ));
    }
  };

  const handleOpenChat = (driver) => {
    setChatRecipient(driver);
    setCurrentTab('messages');
  }

  // --- General Handlers ---
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
          onUpdateDriver={handleUpdateDriverStatus} // Admin can change status
          onDeleteDriver={handleDeleteDriver}
          onSaveDriver={handleSaveDriver} // Admin can create/edit
        />;
      case "owners":
        return <ClientManagement 
          owners={owners} 
          drivers={drivers}
          tracks={tracks}
          onSaveOwner={handleSaveOwner} 
          onDeleteOwner={handleDeleteOwner} 
          onAssignDriver={handleAssignDriver}
          onUnassignDriver={handleUnassignDriver}
          onApproveMaterial={handleApproveMaterial}
          onRateDriver={handleRateDriver}
          onOpenChat={handleOpenChat}
        />;
      case "fleet":
        return <FleetTracking 
          tracks={tracks} 
          drivers={drivers}
          onToggleAvailability={handleToggleAvailability} // Admin can manage availability
        />;
      case "messages":
        return <Messages 
          messages={messages} 
          onSendMessage={handleSendMessage}
          drivers={drivers}
          owners={owners}
          initialRecipient={chatRecipient}
        />;
      case "admin":
        return <AdminRoleAndAppManagement 
            onSaveUser={handleSaveUser}
        />;
      case "about":
        return <About />;
      default:
        return <Dashboard stats={stats} recentActivities={recentActivities} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
