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
  Package,
  Send,
  Paperclip,
  Eye,
  EyeOff,
  UserPlus,
  Save,
  Camera
} from "lucide-react";

// --- BOILERPLATE/HELPER COMPONENTS ---

const Header = ({ title, actions }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
    <div>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-2">Manage your logistics operations efficiently</p>
    </div>
    {actions && <div className="flex-shrink-0">{actions}</div>}
  </div>
);

const Section = ({ title, children, className = "", description }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${className}`}>
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-gray-600 mt-2 text-sm">{description}</p>}
    </div>
    {children}
  </div>
);

const Card = ({ children, className = "", onClick, hover = false }) => (
  <div 
    onClick={onClick} 
    className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 ${
      hover ? "hover:shadow-md hover:border-blue-100 cursor-pointer" : ""
    } ${className}`}
  >
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", size = "md", ...props }) => {
  const base = "inline-flex items-center justify-center border font-medium rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeMap = { 
    sm: "px-3 py-2 text-sm", 
    md: "px-5 py-2.5 text-sm", 
    lg: "px-6 py-3 text-base" 
  };
  const variantMap = {
    primary: "border-transparent bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500",
    secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    success: "border-transparent bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500",
    error: "border-transparent bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500",
    outline: "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
  };
  const disabled = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <button className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${disabled}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input 
      type={type} 
      className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200" 
      {...props} 
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select className="block w-full border border-gray-300 rounded-xl shadow-sm p-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200" {...props}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, onFileChange, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label || "Upload File"}</label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG</p>
        </div>
        <input type="file" onChange={onFileChange} className="hidden" {...props} />
      </label>
    </div>
  </div>
);

const RatingStars = ({ rating }) => (
  <div className="flex items-center">
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
        />
      ))}
    </div>
    <span className="ml-2 text-sm text-gray-600">({rating})</span>
  </div>
);

// --- DASHBOARD COMPONENT ---
const Dashboard = ({ stats, drivers }) => {
  const statCards = [
    { label: "Total Drivers", value: stats.totalDrivers, icon: User, variant: "primary", trend: "+12%" },
    { label: "Total Clients", value: stats.totalClients, icon: Truck, variant: "secondary", trend: "+8%" },
    { label: "Total Trucks", value: stats.totalTracks, icon: Car, variant: "default", trend: "+5%" },
    { label: "Available Trucks", value: stats.availableTracks, icon: CheckCircle, variant: "success", trend: "+3%" },
    { label: "Unavailable Trucks", value: stats.unavailableTracks, icon: AlertCircle, variant: "error", trend: "-2%" },
    { label: "Total Requests", value: stats.totalRequests, icon: FileText, variant: "warning", trend: "+15%" },
  ];
  
  const timeStatCards = [
    { label: "Requests (Last Week)", value: stats.requestsLastWeek, icon: Clock, variant: "default" },
    { label: "Requests (Last Month)", value: stats.requestsLastMonth, icon: Clock, variant: "default" },
    { label: "Processed (Last Week)", value: stats.approvedRejectedLastWeek, icon: CheckCircle, variant: "success" },
    { label: "Processed (Last Month)", value: stats.approvedRejectedLastMonth, icon: CheckCircle, variant: "success" },
  ];
  
  return (
    <div className="space-y-8">
      <Header 
        title="Dashboard Overview" 
        description="Monitor your logistics operations and key performance indicators"
      />
      
      {/* Main Stats */}
      <Section 
        title="Key Logistics Metrics" 
        description="Overview of your fleet, drivers, and request volumes"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:scale-105 transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                    <div className={`inline-flex items-center text-sm font-medium ${
                      card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        card.trend.startsWith('+') ? '' : 'rotate-180'
                      }`} />
                      {card.trend}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    card.variant === 'primary' ? 'bg-blue-50' :
                    card.variant === 'secondary' ? 'bg-purple-50' :
                    card.variant === 'success' ? 'bg-green-50' :
                    card.variant === 'error' ? 'bg-red-50' :
                    card.variant === 'warning' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      card.variant === 'primary' ? 'text-blue-600' :
                      card.variant === 'secondary' ? 'text-purple-600' :
                      card.variant === 'success' ? 'text-green-600' :
                      card.variant === 'error' ? 'text-red-600' :
                      card.variant === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Time-Based Request Stats */}
      <Section 
        title="Request & Order Velocity" 
        description="Track request processing and completion rates over time"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeStatCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="text-center group hover:shadow-md transition-shadow duration-200">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                  card.variant === 'success' ? 'bg-green-50' : 'bg-gray-50'
                } mb-4`}>
                  <Icon className={`w-6 h-6 ${
                    card.variant === 'success' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600">{card.label}</p>
              </Card>
            );
          })}
        </div>
      </Section>
      
      <TrackingStatus drivers={drivers} />
    </div>
  );
};

// --- FLEET TRACKING COMPONENT ---
const FleetTracking = ({ tracks, drivers }) => {
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
    <div className="space-y-8">
      <Header 
        title="Fleet Tracking & Availability" 
        description="Monitor truck status, assignments, and driver availability in real-time"
      />
      
      <Section 
        title="Truck Fleet Overview" 
        description="Complete list of all trucks with their current status and assignments"
      >
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Truck Plate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Model</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Availability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned Driver</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {trackDetails.map(track => (
                  <tr key={track.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{track.plate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{track.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={track.isAvailable ? 'success' : 'error'} className="text-xs">
                        {track.isAvailable ? 'Available' : 'Maintenance'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{track.driverName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={track.statusColor} className="text-xs">
                        {track.driverStatus.toUpperCase().replace(/_/g, ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
      
      <TrackingStatus drivers={drivers} />
    </div>
  );
};

// --- MESSAGES COMPONENT ---
const Messages = ({ messages = [], onSendMessage, drivers = [], owners = [] }) => {
  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const activeThreads = useMemo(() => {
    const threads = [];
    
    drivers.forEach(driver => {
      if (driver.assignedClientId) {
        const client = owners.find(owner => owner.id === driver.assignedClientId);
        if (client) {
          threads.push({
            id: `${driver.id}-${client.id}`,
            driverId: driver.id,
            driverName: driver.name,
            clientId: client.id,
            clientName: client.name,
            driverPhoto: driver.photoUrl,
            clientPhoto: null,
            lastMessage: messages
              .filter(msg => 
                (msg.senderId === driver.id && msg.receiverId === client.id) ||
                (msg.senderId === client.id && msg.receiverId === driver.id)
              )
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0],
            requestInfo: `Request: ${driver.truckNumber} Assignment`
          });
        }
      }
    });

    return threads;
  }, [drivers, owners, messages]);

  const threadMessages = useMemo(() => {
    if (!activeThread) return [];
    
    return messages
      .filter(msg => 
        (msg.senderId === activeThread.driverId && msg.receiverId === activeThread.clientId) ||
        (msg.senderId === activeThread.clientId && msg.receiverId === activeThread.driverId) ||
        (msg.senderType === 'admin' && 
         ((msg.receiverId === activeThread.driverId && msg.senderId === activeThread.clientId) ||
          (msg.receiverId === activeThread.clientId && msg.senderId === activeThread.driverId)))
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messages, activeThread]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    if (activeThread && onSendMessage) {
      onSendMessage({
        threadId: activeThread.id,
        senderId: 'admin',
        senderName: 'System Admin',
        senderType: 'admin',
        receiverId: null,
        content: newMessage,
        attachments: attachments,
        timestamp: new Date().toISOString()
      });
      
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files.map(file => ({
      id: generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }))]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div className="space-y-8">
      <Header 
        title="Direct Client-Driver Messaging" 
        description="Coordinate shipments and communicate directly with drivers and clients"
      />
      
      <Section 
        title="Communication Hub" 
        className="p-0 overflow-hidden"
        description="Real-time messaging between clients, drivers, and administrators"
      >
        <div className="flex flex-col lg:flex-row h-[600px] border border-gray-200 rounded-2xl overflow-hidden">
          {/* Threads Sidebar */}
          <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 text-lg">Active Threads</h3>
              <p className="text-sm text-gray-600 mt-1">Based on requests with assigned drivers</p>
            </div>
            
            <div className="overflow-y-auto h-full">
              {activeThreads.map(thread => (
                <div
                  key={thread.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
                    activeThread?.id === thread.id 
                      ? 'bg-blue-50 border-r-4 border-blue-500' 
                      : 'hover:bg-white'
                  }`}
                  onClick={() => setActiveThread(thread)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={thread.driverPhoto}
                        alt={thread.driverName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {thread.clientName} & {thread.driverName}
                        </h4>
                        {thread.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(thread.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {thread.requestInfo}
                      </p>
                      {thread.lastMessage && (
                        <p className="text-sm text-gray-700 truncate mt-2">
                          {thread.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {activeThreads.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No active threads</p>
                  <p className="text-sm mt-1">Threads appear when drivers are assigned to clients</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={activeThread.driverPhoto}
                        alt={activeThread.driverName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                        {activeThread.clientName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activeThread.clientName} & {activeThread.driverName}
                      </h3>
                      <p className="text-sm text-gray-600">{activeThread.requestInfo}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
                  {threadMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation</p>
                    </div>
                  ) : (
                    threadMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderType === 'admin' 
                            ? 'justify-center' 
                            : message.senderId === activeThread.driverId 
                              ? 'justify-start' 
                              : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.senderType === 'admin'
                              ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                              : message.senderId === activeThread.driverId
                                ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          }`}
                        >
                          {message.senderType === 'admin' && (
                            <div className="text-xs font-semibold mb-1 flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              System Admin
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map(att => (
                                <div key={att.id} className={`flex items-center space-x-2 text-xs px-2 py-1 rounded-lg ${
                                  message.senderId === activeThread.driverId 
                                    ? 'bg-gray-100 text-gray-700' 
                                    : 'bg-blue-500 bg-opacity-20 text-blue-700'
                                }`}>
                                  <Paperclip className="w-3 h-3" />
                                  <span className="truncate">{att.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className={`text-xs mt-2 ${
                            message.senderType === 'admin' 
                              ? 'text-yellow-600' 
                              : message.senderId === activeThread.driverId
                                ? 'text-gray-500'
                                : 'text-blue-200'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 bg-white p-6">
                  {attachments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <Paperclip className="w-4 h-4 text-gray-600" />
                            <div>
                              <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({(attachment.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a coordination message to the thread (Admin only)..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <label className="cursor-pointer p-3 text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <Paperclip className="w-5 h-5" />
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() && attachments.length === 0}
                        className="px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <MessageCircle className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <p className="font-medium text-lg mb-2">Select a conversation</p>
                  <p className="text-gray-600">Choose a thread from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

// --- DOCUMENTS COMPONENT ---
const Documents = ({ requests }) => {
  const waybillRequests = requests.filter(req => 
    req.driverWaybillUrl || req.clientWaybillUrl
  );

  return (
    <div className="space-y-8">
      <Header 
        title="Document Management" 
        description="Access and manage all waybill documents and shipment paperwork"
      />
      
      <Section 
        title="Waybill Documents" 
        description="Digital waybills uploaded by drivers and clients for each shipment"
      >
        {waybillRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-lg mb-2">No waybill documents available</p>
            <p className="text-gray-600">Waybills will appear here once uploaded by drivers and clients</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Request ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cargo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver Waybill</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client Waybill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {waybillRequests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                          {request.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.cargo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          {request.driverName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.driverWaybillUrl ? (
                          <a 
                            href={request.driverWaybillUrl} 
                            target="_blank" 
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors duration-200"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Waybill</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Not uploaded</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.clientWaybillUrl ? (
                          <a 
                            href={request.clientWaybillUrl} 
                            target="_blank" 
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors duration-200"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Waybill</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Not uploaded</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};

// --- USER MANAGEMENT COMPONENT ---
const UserManagement = ({ users, drivers, onSaveUser, onDeleteUser, onSaveDriver }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const userRoles = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'driver', label: 'Driver' },
    { value: 'client', label: 'Client' }
  ];

  const handleSaveUser = (userData) => {
    onSaveUser(userData);
    setEditingUser(null);
  };

  const handleSaveDriverDetails = (driverData) => {
    onSaveDriver(driverData);
    setEditingDriver(null);
  };

  const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user || {
      name: '',
      telephone: '',
      email: '',
      role: 'user',
      password: '',
      photoUrl: null,
      isActive: true
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">
          {user ? 'Edit User' : 'Create New User'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={userRoles}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FileUpload
              label="Profile Photo"
              onFileChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setFormData({ ...formData, photoUrl: e.target.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active Account
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const DriverDetailsForm = ({ driver, onSave, onCancel }) => {
    const [formData, setFormData] = useState(driver || {
      driverLicenseUrl: null,
      truckNumber: '',
      carOwnerName: '',
      carOwnerTelephone: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">
          {driver ? 'Edit Driver Details' : 'Add Driver Details'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Driver License"
              onFileChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setFormData({ ...formData, driverLicenseUrl: e.target.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Input
              label="Truck Number"
              value={formData.truckNumber}
              onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
              placeholder="e.g., SL-TRK-9921"
            />
            <Input
              label="Car Owner Name"
              value={formData.carOwnerName}
              onChange={(e) => setFormData({ ...formData, carOwnerName: e.target.value })}
            />
            <Input
              label="Car Owner Telephone"
              type="tel"
              value={formData.carOwnerTelephone}
              onChange={(e) => setFormData({ ...formData, carOwnerTelephone: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {driver ? 'Update Details' : 'Save Details'}
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Header 
        title="User Management" 
        description="Manage user accounts, roles, and driver details across the platform"
        actions={
          <Button onClick={() => setEditingUser({})}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        } 
      />

      {/* Tabs */}
      <Card className="p-2">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            User Accounts
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'drivers'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Driver Management
          </button>
        </nav>
      </Card>

      {/* User Accounts Tab */}
      {activeTab === 'users' && (
        <>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => setEditingUser(null)}
            />
          )}

          <Section 
            title="All Users" 
            description="Complete list of all users with their roles and status"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.photoUrl || '/api/placeholder/40/40'}
                              alt={user.name}
                              className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center text-gray-500 mb-1">
                            <Phone className="w-4 h-4 mr-2" />
                            {user.telephone}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={
                            user.role === 'admin' ? 'primary' :
                            user.role === 'driver' ? 'secondary' :
                            user.role === 'client' ? 'warning' : 'default'
                          }>
                            {user.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.isActive ? 'success' : 'error'}>
                            {user.isActive ? 'ACTIVE' : 'DISABLED'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 justify-end">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="error"
                              onClick={() => onDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* Driver Management Tab */}
      {activeTab === 'drivers' && (
        <>
          {editingDriver && (
            <DriverDetailsForm
              driver={editingDriver}
              onSave={handleSaveDriverDetails}
              onCancel={() => setEditingDriver(null)}
            />
          )}

          <Section 
            title="Driver Details Management" 
            description="Manage driver licenses, truck assignments, and owner information"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Truck Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Car Owner</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver License</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {drivers.map(driver => (
                      <tr key={driver.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={driver.photoUrl}
                              alt={driver.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">{driver.telephone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {driver.truckNumber || (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{driver.carOwnerName || 'N/A'}</div>
                          <div className="text-gray-500">{driver.carOwnerTelephone || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {driver.driverLicenseUrl ? (
                            <a
                              href={driver.driverLicenseUrl}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 transition-colors duration-200"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View License</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Not uploaded</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingDriver(driver)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

// --- SETTINGS COMPONENT ---
const Settings = ({ currentUser, onSaveUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(currentUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveUser(userData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setUserData(currentUser);
    setIsEditing(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, photoUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <Header 
        title="Settings & Profile" 
        description="Manage your account settings, preferences, and security options"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile Settings', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Section 
              title="Profile Settings" 
              description="Update your personal information and profile photo"
            >
              {saved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-green-700 text-sm font-medium">Profile updated successfully!</span>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={userData.photoUrl || '/api/placeholder/150/150'}
                      alt={userData.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                        <Camera className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="flex-1">
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Username"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Telephone"
                        type="tel"
                        value={userData.telephone}
                        onChange={(e) => setUserData({ ...userData, telephone: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>

                  {!isEditing && (
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {activeTab === 'security' && (
            <Section 
              title="Security Settings" 
              description="Manage your password and account security preferences"
            >
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                    Show passwords
                  </label>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                )}
              </form>

              {!isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              )}

              {/* Security Status */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4">Security Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Last password change</span>
                    <span className="text-sm font-medium text-gray-900">2 months ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Two-factor authentication</span>
                    <Badge variant="error">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600">Login activity</span>
                    <span className="text-sm font-medium text-green-600">Active now</span>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {activeTab === 'preferences' && (
            <Section 
              title="Preferences" 
              description="Customize your language, timezone, and email preferences"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <Select
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'so', label: 'Somali' },
                      { value: 'ar', label: 'Arabic' }
                    ]}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <Select
                    options={[
                      { value: 'east-africa', label: 'East Africa Time (EAT)' },
                      { value: 'utc', label: 'UTC' }
                    ]}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Email Preferences</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Receive email notifications</p>
                        <p className="text-sm text-gray-600">Get important updates about your shipments</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Receive marketing emails</p>
                        <p className="text-sm text-gray-600">Updates about new features and services</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Preferences
                  </Button>
                </div>
              )}
            </Section>
          )}

          {activeTab === 'notifications' && (
            <Section 
              title="Notification Settings" 
              description="Configure how and when you receive notifications"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Requests</p>
                        <p className="text-sm text-gray-600">Get notified when new shipment requests arrive</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Driver Updates</p>
                        <p className="text-sm text-gray-600">Notifications about driver status changes</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Messages</p>
                        <p className="text-sm text-gray-600">Notifications for new messages</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Notifications
                  </Button>
                </div>
              )}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

// --- DATA STRUCTURES & UTILITIES ---
const now = () => new Date().toISOString();
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const SEED_CAR_OWNER_ID = "co1";
const SEED_DRIVER_ID = "d1";
const SEED_OWNER_ID = "o1";

const REQUEST_STATUSES = {
    PENDING: 'pending',
    APPROVED_BY_DRIVER: 'approved_by_driver',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
};

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
    telephone: "+25263 555 1122",
    email: "ahmed.ali@example.com",
    status: "idle",
    truckNumber: "SL-TRK-9921",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    assignedClientId: null,
    identityVerified: true,
    currentLocation: { lat: 9.5616, lng: 44.0650 },
    routeProgress: 0,
    driverLicenseUrl: null,
    carOwnerName: "Mohamed Ali",
    carOwnerTelephone: "+25263 555 1123"
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    telephone: "+25263 777 9010",
    email: "hodan.warsame@example.com",
    status: "idle",
    truckNumber: "SL-TRK-4410",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.2,
    assignedClientId: null,
    identityVerified: true,
    currentLocation: { lat: 10.4340, lng: 45.0140 },
    routeProgress: 0,
    driverLicenseUrl: null,
    carOwnerName: "Hodan Transport Co.",
    carOwnerTelephone: "+25263 777 9011"
  },
];

const seedOwners = [
  { 
    id: SEED_OWNER_ID, 
    name: "Abdi Buyer Co.", 
    location: "Hargeisa Market", 
    telephone: "+25263 600 1010", 
    email: "abdi@buyerco.com",
    contactPerson: "Abdi Hassan",
    assignedDrivers: [],
    rating: 4.7
  },
  { 
    id: "o2", 
    name: "Zahra Import Export", 
    location: "Borama Trade Center", 
    telephone: "+25263 600 2020", 
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
    { 
      id: 'u1', 
      username: 'admin', 
      password: 'password123', 
      role: 'admin', 
      name: 'System Administrator', 
      telephone: '+25263 000 0001',
      email: 'admin@heeylogistics.com',
      photoUrl: null,
      isActive: true,
      permissions: ['all'] 
    },
    { 
      id: 'u2', 
      username: 'ahmed_ali', 
      password: 'driver123', 
      role: 'driver', 
      name: 'Ahmed Ali', 
      telephone: '+25263 555 1122',
      email: 'ahmed.ali@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      permissions: [] 
    },
    { 
      id: 'u3', 
      username: 'abdi_buyer', 
      password: 'owner123', 
      role: 'client', 
      name: 'Abdi Hassan', 
      telephone: '+25263 600 1010',
      email: 'abdi@buyerco.com',
      photoUrl: null,
      isActive: true,
      permissions: [] 
    },
    { 
      id: 'u4', 
      username: 'hodan_warsame', 
      password: 'driver123', 
      role: 'driver', 
      name: 'Hodan Warsame', 
      telephone: '+25263 777 9010',
      email: 'hodan.warsame@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      permissions: [] 
    },
];

const seedMessages = [
  {
    id: 'm1',
    threadId: 'd1-o1',
    senderId: 'o1',
    senderName: 'Abdi Buyer Co.',
    senderType: 'client',
    receiverId: 'd1',
    content: 'Hello Ahmed, I noticed the request is pending. Can you confirm your availability for the Berbera to Hargeisa trip?',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'm2',
    threadId: 'd1-o1',
    senderId: 'd1',
    senderName: 'Ahmed Ali',
    senderType: 'driver',
    receiverId: 'o1',
    content: 'Yes, I am available and reviewing the cargo documents now. I should be able to accept it shortly.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'm3',
    threadId: 'd1-o1',
    senderId: 'admin',
    senderName: 'System Admin',
    senderType: 'admin',
    receiverId: null,
    content: 'Admin note: Please ensure all waybill documents are uploaded before the truck begins loading.',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'm4',
    threadId: 'd1-o1',
    senderId: 'admin',
    senderName: 'System Admin',
    senderType: 'admin',
    receiverId: null,
    content: 'Test',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
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
    "unassigned": "default"
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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-xl">Live Tracking</h3>
        <Badge variant="primary" className="text-xs">
          {activeDrivers.length} Active
        </Badge>
      </div>
      
      {activeDrivers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No active deliveries</p>
          <p className="text-sm text-gray-600 mt-1">All drivers are currently idle</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeDrivers.map(driver => {
            const statusInfo = getStatusInfo(driver.status);
            const progress = driver.routeProgress || 0;
            
            return (
              <Card key={driver.id} className="border border-gray-200 hover:border-blue-200 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={driver.photoUrl} 
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                      <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                <div className="flex justify-between relative mb-4">
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                  {[1, 2, 3, 4, 5].map(step => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm ${
                        step <= statusInfo.step ? statusInfo.color : 'bg-gray-300'
                      }`}>
                        {step}
                      </div>
                      <span className="text-xs text-gray-600 mt-2 text-center">
                        {['Loading', 'Transit', 'Customs', 'Unloading', 'Delivered'][step - 1]}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Current location */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>Current: {driver.currentLocation ? `${driver.currentLocation.lat.toFixed(4)}, ${driver.currentLocation.lng.toFixed(4)}` : 'Tracking...'}</span>
                </div>
              </Card>
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
  ];
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HeeyLogistics</h1>
            <p className="text-blue-200 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
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
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-blue-700/30 backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm font-semibold text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-blue-200 truncate">Administrator</p>
          </div>
          <Button variant="outline" size="sm" className="!text-blue-200 !border-blue-600 hover:!bg-blue-600">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- REQUEST MANAGEMENT COMPONENT ---
const RequestManagement = ({ requests, drivers, onDriverResponse }) => {
    return (
        <div className="space-y-8">
            <Header 
                title="Request & Order Management" 
                description="Monitor and manage all logistics requests and order statuses"
            />
            <Section 
                title="All Logistics Requests" 
                description="Complete overview of all shipment requests with their current status"
            >
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID / Cargo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Request Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracking Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Waybills</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {requests.map(req => {
                                const driver = drivers.find(d => d.id === req.driverId);
                                return (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-medium text-gray-900 truncate w-32">{req.cargo}</p>
                                        <p className="text-sm text-gray-500">Route: {req.origin} to {req.destination}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        {req.driverName}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={getRequestStatusVariant(req.status)}>
                                          {req.status.replace(/_/g, ' ').toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {req.status === REQUEST_STATUSES.ACCEPTED ? (
                                            <Badge variant={getStatusColor(driver?.status)}>
                                              {driver?.status.toUpperCase().replace(/_/g, ' ') || 'IDLE'}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-gray-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <a href={req.driverWaybillUrl} target="_blank" className={`text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors duration-200 ${!req.driverWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>
                                          <FileText className="w-4 h-4" /> 
                                          <span>Driver WB {req.driverWaybillUrl ? '✔' : '❌'}</span>
                                        </a>
                                        <a href={req.clientWaybillUrl} target="_blank" className={`text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors duration-200 mt-1 ${!req.clientWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>
                                          <FileText className="w-4 h-4" /> 
                                          <span>Client WB {req.clientWaybillUrl ? '✔' : '❌'}</span>
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {req.status === REQUEST_STATUSES.PENDING && (
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="success" onClick={() => onDriverResponse(req.id, 'accept')}>
                                                  Force Accept
                                                </Button>
                                            </div>
                                        )}
                                        {req.status === REQUEST_STATUSES.ACCEPTED && (
                                            <Button size="sm" variant="secondary" onClick={() => onDriverResponse(req.id, 'completed')}>
                                              Mark Complete
                                            </Button>
                                        )}
                                        {(req.status === REQUEST_STATUSES.PENDING || req.status === REQUEST_STATUSES.APPROVED_BY_DRIVER) && (
                                            <Button size="sm" variant="error" onClick={() => onDriverResponse(req.id, 'reject')} className="ml-2">
                                              Reject
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                  </div>
                </div>
            </Section>
        </div>
    );
};

// --- DRIVER DASHBOARD VIEW ---
const DriverDashboardView = ({ drivers, requests, onDriverResponse, onDriverStatusUpdate, currentDriver }) => {
    
    const pendingRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.PENDING);
    const approvedRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.APPROVED_BY_DRIVER);
    const activeRequests = requests.filter(req => req.driverId === currentDriver.id && req.status === REQUEST_STATUSES.ACCEPTED);
    
    const [newStatus, setNewStatus] = useState(currentDriver.status);
    const [waybillFile, setWaybillFile] = useState(null);

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        onDriverStatusUpdate(currentDriver.id, newStatus, newStatus === 'loading' ? waybillFile : null);
        setWaybillFile(null); 
    };
    
    return (
        <div className="space-y-8">
            <Header 
                title={`Driver Dashboard: ${currentDriver.name}`} 
                description="Manage your shipments, update status, and handle waybill documents"
            />

            {/* Status Update & Waybill Upload */}
            <Section 
                title="Update Current Status" 
                description="Track your shipment progress and upload required documents"
            >
                <form onSubmit={handleStatusUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Select 
                            label={`Driver Status: ${currentDriver.status.toUpperCase().replace(/_/g, ' ')}`}
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            options={DRIVER_STATUS_OPTIONS.filter(o => o.value !== 'pending_request')} 
                        />
                        <div>
                            {newStatus === 'loading' && (
                                <FileUpload 
                                    label="Upload Waybill Receipt"
                                    onFileChange={(e) => setWaybillFile(e.target.files[0])}
                                />
                            )}
                        </div>
                    </div>
                    <Button type="submit" disabled={newStatus === currentDriver.status}>
                      Update Status
                    </Button>
                </form>
            </Section>

            {/* Incoming Requests */}
            <Section 
                title="Incoming Shipment Requests" 
                description="Review and respond to new shipment requests from clients"
            >
                <div className="space-y-4">
                    {pendingRequests.map(req => (
                        <Card key={req.id} className="border border-yellow-200 bg-yellow-50 hover:border-yellow-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Request from {req.clientName}</h4>
                                    <p className="text-sm text-gray-600 mt-1">Cargo: {req.cargo} | Route: {req.origin} to {req.destination}</p>
                                </div>
                                <Badge variant="warning">PENDING</Badge>
                            </div>
                            <div className="mt-4 pt-4 border-t border-yellow-200 flex justify-end space-x-3">
                                <Button size="sm" variant="secondary" onClick={() => onDriverResponse(req.id, 'approve')}>
                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve Request
                                </Button>
                                <Button size="sm" variant="error" onClick={() => onDriverResponse(req.id, 'reject')}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {pendingRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No new pending requests</p>
                        </div>
                    )}
                </div>
            </Section>

            {/* Approved Requests */}
            <Section 
                title="Approved Requests" 
                description="Requests ready for pickup and assignment"
            >
                <div className="space-y-4">
                    {approvedRequests.map(req => (
                        <Card key={req.id} className="border border-purple-200 bg-purple-50 hover:border-purple-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Request for {req.cargo}</h4>
                                    <p className="text-sm text-gray-600 mt-1">Client: {req.clientName} | **Ready for Pickup**</p>
                                </div>
                                <Badge variant="secondary">APPROVED</Badge>
                            </div>
                            <div className="mt-4 pt-4 border-t border-purple-200 flex justify-end">
                                <Button size="sm" variant="success" onClick={() => onDriverResponse(req.id, 'accept')}>
                                    <Truck className="w-4 h-4 mr-1" /> Accept & Assign
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {approvedRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No approved requests ready for acceptance</p>
                        </div>
                    )}
                </div>
            </Section>
            
            {/* Active Requests */}
            <Section 
                title="Active Assigned Shipments" 
                description="Currently active shipments with tracking information"
            >
                <div className="space-y-4">
                    {activeRequests.map(req => (
                        <Card key={req.id} className="border border-blue-200 bg-blue-50 hover:border-blue-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{req.cargo}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Route: {req.origin} to {req.destination}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Client: {req.clientName} | Current Status: {' '}
                                      <Badge variant={getStatusColor(currentDriver.status)} className="ml-1">
                                        {currentDriver.status.toUpperCase().replace(/_/g, ' ')}
                                      </Badge>
                                    </p>
                                    <a href={req.driverWaybillUrl} target="_blank" className={`text-blue-600 text-xs mt-2 block flex items-center space-x-1 ${!req.driverWaybillUrl ? 'opacity-50 pointer-events-none' : ''}`}>
                                      <FileText className="w-3 h-3" />
                                      <span>Driver Waybill {req.driverWaybillUrl ? '✔' : '❌'}</span>
                                    </a>
                                </div>
                                <div>
                                    <Badge variant="primary">ACCEPTED</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {activeRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No active shipments</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};

// --- DRIVER MANAGEMENT COMPONENT ---
const DriverManagement = ({ drivers, requests, onDriverStatusUpdate, onDriverResponse, onSaveDriver, onDeleteDriver }) => {
    const currentDriver = drivers.find(d => d.id === SEED_DRIVER_ID);
    
    const [editingDriver, setEditingDriver] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    if (!currentDriver) return <div>Driver not found.</div>;

    return (
        <div className="space-y-8">
            <Header 
                title="Driver Management" 
                description="Admin and driver views for managing driver operations and assignments"
            />

            {/* Driver Dashboard View */}
            <DriverDashboardView 
                drivers={drivers}
                requests={requests}
                onDriverResponse={onDriverResponse}
                onDriverStatusUpdate={onDriverStatusUpdate}
                currentDriver={currentDriver}
            />
            
            {/* Admin Table View */}
            <Section 
                title="All Drivers" 
                description="Complete overview of all drivers with their current status and assignments"
            >
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name/Contact</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Truck/Owner</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Verification/Rating</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Client</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {drivers.map(driver => (
                                <tr key={driver.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img src={driver.photoUrl} alt={driver.name} className="h-10 w-10 rounded-full mr-4 object-cover border-2 border-white shadow-sm" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                                <div className="text-sm text-gray-500">{driver.telephone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <p className="font-medium">{driver.truckNumber}</p>
                                        <p className="text-xs text-gray-500">{driver.carOwnerName || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={getStatusColor(driver.status)}>
                                          {driver.status.toUpperCase().replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            {driver.identityVerified ? (
                                                <Badge variant="success" className="text-xs">
                                                  <Shield className="w-3 h-3 mr-1" /> Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="error" className="text-xs">
                                                  <AlertCircle className="w-3 h-3 mr-1" /> Unverified
                                                </Badge>
                                            )}
                                            <RatingStars rating={driver.rating} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {driver.assignedClientId || (
                                          <span className="text-gray-400">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 justify-end">
                                            <Button size="sm" variant="secondary" onClick={() => {}}>
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
                </div>
            </Section>
        </div>
    );
};

// --- CLIENT DASHBOARD VIEW ---
const ClientDashboardView = ({ drivers, requests, currentClient, onSendRequest, onClientWaybillUpload }) => {
    
    const availableDrivers = drivers.filter(d => 
        d.status === 'idle' && 
        !requests.some(r => r.driverId === d.id && r.status !== REQUEST_STATUSES.REJECTED && r.status !== REQUEST_STATUSES.COMPLETED)
    );
    
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [cargoDetails, setCargoDetails] = useState({ cargo: '', origin: 'Berbera Port', destination: 'Hargeisa Warehouse' });

    const activeRequest = requests.find(r => r.clientId === currentClient.id && r.status === REQUEST_STATUSES.ACCEPTED);
    const assignedDriver = activeRequest ? drivers.find(d => d.id === activeRequest.driverId) : null;
    
    const handleRequestSubmit = () => {
        if (selectedDriverId && cargoDetails.cargo && cargoDetails.origin && cargoDetails.destination) {
            onSendRequest(currentClient.id, selectedDriverId, cargoDetails.cargo, cargoDetails.origin, cargoDetails.destination);
            setSelectedDriverId(null);
            setCargoDetails({ cargo: '', origin: 'Berbera Port', destination: 'Hargeisa Warehouse' });
        } else {
            alert('Please select a driver and fill in all shipment details.');
        }
    };

    const handleWaybillUpload = (requestId, file) => {
        onClientWaybillUpload(requestId, file);
    };

    return (
        <div className="space-y-8">
            <Header 
                title={`Client Dashboard: ${currentClient.name}`} 
                description="Manage your shipments, track drivers, and upload required documents"
            />

            {/* Active Order Tracking */}
            <Section 
                title="Active Order Tracking" 
                description="Real-time tracking of your current shipments and driver status"
            >
                {assignedDriver ? (
                    <div>
                        <div className="flex items-center space-x-4 mb-6">
                            <img 
                                src={assignedDriver.photoUrl} 
                                alt={assignedDriver.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900">Driver: {assignedDriver.name}</h3>
                                <p className="text-sm text-gray-600">Truck: {assignedDriver.truckNumber}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Request ID: {activeRequest.id.slice(0, 6)} | Cargo: {activeRequest.cargo}
                        </p>
                        <div className="flex items-center space-x-3 mb-4">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <p className="text-lg font-bold text-gray-900">
                              Current Status: {' '}
                              <Badge variant={getStatusColor(assignedDriver.status)} className="ml-2">
                                {assignedDriver.status.toUpperCase().replace(/_/g, ' ')}
                              </Badge>
                            </p>
                        </div>
                        <TrackingStatus drivers={[assignedDriver]} className="mt-4 p-0 shadow-none border-none" />
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No active assigned drivers</p>
                        <p className="text-sm text-gray-600 mt-1">Send a request below to get started!</p>
                    </div>
                )}
            </Section>

            {/* Send New Shipment Request */}
            <Section 
                title="Send New Shipment Request" 
                description="Select available drivers and provide shipment details for new requests"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Available Drivers/Trucks</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {availableDrivers.map(driver => (
                                <Card 
                                    key={driver.id} 
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        selectedDriverId === driver.id 
                                          ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' 
                                          : 'hover:border-blue-300'
                                    }`}
                                    onClick={() => setSelectedDriverId(driver.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <User className="w-8 h-8 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{driver.name}</p>
                                                <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                                            </div>
                                        </div>
                                        {selectedDriverId === driver.id && (
                                          <CheckCircle className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                </Card>
                            ))}
                            {availableDrivers.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No idle drivers available right now</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Shipment Details</h3>
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

            {/* Client Waybill Upload */}
            <Section 
                title="My Requests Status & Waybills" 
                description="Track your request status and upload required waybill documents"
            >
                <div className="space-y-4">
                    {requests.filter(r => r.clientId === currentClient.id).map(req => (
                        <Card key={req.id} className="hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {req.cargo} (Req ID: {req.id.slice(0, 6)})
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Driver: {req.driverName} | Status: {' '}
                                      <Badge variant={getRequestStatusVariant(req.status)}>
                                        {req.status.toUpperCase().replace(/_/g, ' ')}
                                      </Badge>
                                    </p>
                                </div>
                                
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-700 font-medium">Client Waybill Receipt:</p>
                                {req.clientWaybillUrl ? (
                                    <a href={req.clientWaybillUrl} target="_blank" className="text-green-600 text-sm flex items-center space-x-2 transition-colors duration-200">
                                        <CheckCircle className="w-4 h-4" /> 
                                        <span>View Uploaded</span>
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
                {requests.filter(r => r.clientId === currentClient.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No requests initiated yet</p>
                    </div>
                )}
            </Section>
        </div>
    );
};

// --- CLIENT MANAGEMENT COMPONENT ---
const ClientManagement = ({ drivers, owners, requests, onSendRequest, onClientWaybillUpload, onSaveOwner, onDeleteOwner }) => {
    const currentClient = owners.find(o => o.id === SEED_OWNER_ID);

    if (!currentClient) return <div>Client not found.</div>;

    return (
        <div className="space-y-8">
            <Header 
                title="Client Management" 
                description="Admin and client views for managing client operations and shipments"
            />

            {/* Client Dashboard View */}
            <ClientDashboardView 
                drivers={drivers}
                requests={requests}
                currentClient={currentClient}
                onSendRequest={onSendRequest}
                onClientWaybillUpload={onClientWaybillUpload}
                owners={owners}
            />
            
            {/* Admin Table View */}
            <Section 
                title="All Clients" 
                description="Complete overview of all clients and their active shipments"
            >
                <div className="text-center py-8 text-gray-500">
                    <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Client management table view</p>
                </div>
            </Section>
        </div>
    );
};

// --- APP COMPONENT ---
const App = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [users, setUsers] = useState(seedUsers);
  const [messages, setMessages] = useState(seedMessages);
  const [requests, setRequests] = useState(seedRequests);

  const currentUser = users[0];

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

  const stats = useMemo(() => calculateStats(drivers, tracks, requests, owners), [drivers, tracks, requests, owners]);

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

      setDrivers(prevDrivers => prevDrivers.map(d => 
          d.id === driverId ? { ...d, status: 'pending_request' } : d
      ));

      return true;
  };

  const handleDriverResponse = (requestId, action) => {
      setRequests(prevRequests => prevRequests.map(req => {
          if (req.id === requestId) {
              let newStatus = req.status;
              const driverId = req.driverId;
              const clientId = req.clientId;

              if (action === 'approve') {
                  newStatus = REQUEST_STATUSES.APPROVED_BY_DRIVER;
              } else if (action === 'accept') {
                  newStatus = REQUEST_STATUSES.ACCEPTED;
                  
                  setDrivers(prevDrivers => prevDrivers.map(d =>
                      d.id === driverId ? { ...d, assignedClientId: clientId, status: 'idle' } : d
                  ));

                  setOwners(prevOwners => prevOwners.map(o =>
                      o.id === clientId ? { ...o, assignedDrivers: [...new Set([...o.assignedDrivers, driverId])] } : o
                  ));
              } else if (action === 'reject' || action === 'completed') {
                  newStatus = action === 'reject' ? REQUEST_STATUSES.REJECTED : REQUEST_STATUSES.COMPLETED;

                  setDrivers(prevDrivers => prevDrivers.map(d =>
                      d.id === driverId ? { ...d, assignedClientId: null, status: 'idle' } : d
                  ));
                  
                  setOwners(prevOwners => prevOwners.map(o =>
                      o.id === clientId ? { ...o, assignedDrivers: o.assignedDrivers.filter(id => id !== driverId) } : o
                  ));
              }

              return { ...req, status: newStatus };
          }
          return req;
      }));
  };

  const handleDriverStatusUpdate = (driverId, newStatus, waybillFile) => {
      setDrivers(prevDrivers => {
          const updatedDrivers = prevDrivers.map(d => 
              d.id === driverId ? { ...d, status: newStatus } : d
          );
          return updatedDrivers;
      });

      setRequests(prevRequests => {
          const activeRequest = prevRequests.find(req => 
              req.driverId === driverId && req.status === REQUEST_STATUSES.ACCEPTED
          );
          
          if (activeRequest) {
              const driverWaybillUrl = (newStatus === 'loading' && waybillFile) 
                  ? `/driver/${driverId}/${waybillFile.name}`
                  : activeRequest.driverWaybillUrl;

              return prevRequests.map(req => 
                  req.id === activeRequest.id ? 
                  { ...req, driverWaybillUrl, currentDriverStatus: newStatus } : 
                  req
              );
          }
          
          return prevRequests.map(req => 
              req.driverId === driverId ? 
              { ...req, currentDriverStatus: newStatus } : req
          );
      });
  };

  const handleClientWaybillUpload = (requestId, waybillFile) => {
      const waybillUrl = `/client/${requestId}/${waybillFile.name}`;
      setRequests(prevRequests => prevRequests.map(req => 
          req.id === requestId ? { ...req, clientWaybillUrl: waybillUrl } : req
      ));
  };

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: generateId(),
      ...messageData,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSaveUser = (userData) => {
    if (userData.id) {
      setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
      
      if (userData.role === 'driver') {
        setDrivers(prev => prev.map(d => d.id === userData.id ? { ...d, ...userData } : d));
      }
    } else {
      const newUser = {
        ...userData,
        id: generateId(),
        username: userData.email.split('@')[0],
        permissions: []
      };
      setUsers(prev => [...prev, newUser]);
      
      if (userData.role === 'driver') {
        const newDriver = {
          ...newUser,
          status: 'idle',
          rating: 0,
          assignedClientId: null,
          identityVerified: false,
          currentLocation: { lat: 0, lng: 0 },
          routeProgress: 0,
          driverLicenseUrl: null,
          truckNumber: '',
          carOwnerName: '',
          carOwnerTelephone: ''
        };
        setDrivers(prev => [...prev, newDriver]);
      }
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setDrivers(prev => prev.filter(d => d.id !== userId));
  };

  const handleSaveDriver = (driverData) => {
    if (driverData.id) {
      setDrivers(prev => prev.map(d => d.id === driverData.id ? { ...d, ...driverData } : d));
    }
  };

  const handleSaveOwner = () => alert("Owner save not implemented.");
  const handleDeleteOwner = () => alert("Owner delete not implemented.");
  const handleAssignDriver = () => alert("Assign driver not implemented.");
  const handleUnassignDriver = () => alert("Unassign driver not implemented.");
  const handleRateDriver = () => alert("Rate driver not implemented.");
  const handleMarkArrived = () => alert("Mark arrived not implemented.");
  const handleAssignDriverToTrack = () => alert("Assign driver to track not implemented.");
  const handleUpdateAvailability = () => alert("Update availability not implemented."); 
  
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
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
          onDeleteDriver={handleDeleteUser}
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
        return <Documents requests={requests} />;
      case "user-management":
        return <UserManagement 
          users={users} 
          drivers={drivers}
          onSaveUser={handleSaveUser} 
          onDeleteUser={handleDeleteUser}
          onSaveDriver={handleSaveDriver}
        />;
      case "settings":
        return <Settings currentUser={currentUser} onSaveUser={handleSaveUser} />;
      default:
        return <Dashboard stats={stats} drivers={drivers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;