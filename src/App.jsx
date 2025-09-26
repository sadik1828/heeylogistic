import React, { useMemo, useState } from "react";

// --- UPDATED TYPES AND DATA STRUCTURES ----------------------------------------------------
// User:    { id, username, password }
// Driver:  { id, name, address, phone, status, truckNumber, carOwnerId?, 
//            photoUrl, driverLicenseUrl, waybills[],
//            // Car Owner Details (Merged for registration)
//            co_name?, co_phone?, co_ownershipDocUrl? }
// Owner:   { id, name, location, phone, waybills[] }
// Track:   { id, plate, model?, isAvailable, carOwnerId?, assignedDriverId? }
// Message: { id, from: 'admin'|'driver'|'owner', toId: string, text, at }

const now = () => new Date().toISOString();

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
    photoUrl: "https://via.placeholder.com/150?text=Driver+Photo",
    driverLicenseUrl: "https://via.placeholder.com/150?text=License+DL-123",
    waybills: [{ id: "w1", name: "Customs Clearance.pdf", uploadedAt: now(), fileUrl: "https://via.placeholder.com/150?text=Waybill-W1" }],
    carOwnerId: SEED_CAR_OWNER_ID,
    co_name: "Mahad Transport Co.",
    co_phone: "+25263 500 1111",
    co_ownershipDocUrl: "https://via.placeholder.com/150?text=Ownership-O1",
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    phone: "+25263 777 9010",
    status: "custom-reached",
    truckNumber: "SL-TRK-4410",
    photoUrl: "https://via.placeholder.com/150?text=Driver+Photo",
    driverLicenseUrl: "https://via.placeholder.com/150?text=License+DL-984",
    waybills: [{ id: "w2", name: "Waybill-INV-009.pdf", uploadedAt: now(), fileUrl: "https://via.placeholder.com/150?text=Waybill-W2" }],
    carOwnerId: "co2",
    co_name: "Sahal Logistics",
    co_phone: "+25263 500 2222",
    co_ownershipDocUrl: "https://via.placeholder.com/150?text=Ownership-O2",
  },
    {
    id: "d3",
    name: "Omar Farah",
    address: "Borama Logistics Center",
    phone: "+25263 666 3344",
    status: "purchaser-reached",
    truckNumber: "SL-TRK-1050",
    photoUrl: "https://via.placeholder.com/150?text=Driver+Photo",
    driverLicenseUrl: "https://via.placeholder.com/150?text=License+DL-555",
    waybills: [{ id: "w3", name: "Delivery Note.pdf", uploadedAt: now(), fileUrl: "https://via.placeholder.com/150?text=Waybill-W3" }],
    carOwnerId: "co3",
    co_name: "Geeska Transport",
    co_phone: "+25263 500 3333",
    co_ownershipDocUrl: "https://via.placeholder.com/150?text=Ownership-O3",
  },
];

const seedOwners = [
  { id: SEED_OWNER_ID, name: "Abdi Buyer", location: "Hargeisa Market", phone: "+25263 600 1010", waybills: [] },
  { id: "o2", name: "Zahra Import", location: "Borama", phone: "+25263 600 2020", waybills: [] },
];

const seedTracks = [
  { id: SEED_TRACK_ID, plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, carOwnerId: SEED_CAR_OWNER_ID, assignedDriverId: SEED_DRIVER_ID },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: false, carOwnerId: "co2", assignedDriverId: "d2" },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2" },
  { id: "t4", plate: "SL-TRK-1050", model: "Mercedes Actros", isAvailable: false, carOwnerId: "co3", assignedDriverId: "d3" },
];

const seedUsers = [
    { id: 'u1', username: 'admin', password: 'password123', role: 'admin' },
    { id: 'u2', username: 'ahmed_ali', password: 'driver123', role: 'driver' },
    { id: 'u3', username: 'abdi_buyer', password: 'owner123', role: 'owner' },
];

// Seed messages with a recipient ID (toId)
const seedMessages = [
    { id: "m1", from: "owner", toId: SEED_DRIVER_ID, text: "Driver on the way to customs?", at: now() },
    { id: "m2", from: "driver", toId: "u1", text: "Yes, 10 minutes out from customs.", at: now() },
    { id: "m3", from: "admin", toId: "o2", text: "Zahra, please check your waybill upload.", at: now() },
];


// --- HELPER COMPONENTS ------------------------------------------------------------------

function Section({ title, children }) {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
      {children}
    </section>
  );
}

function ViewFileLink({ url, text }) {
  if (!url) return <span className="text-gray-400">— N/A —</span>;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer" 
      className="inline-flex items-center text-blue-600 hover:text-blue-800 underline font-medium text-sm transition"
    >
        📄 {text}
    </a>
  );
}

function WaybillWidget({ items, onUpload }) {
  const [fileName, setFileName] = useState("");
  const generateFileUrl = (name) => `https://via.placeholder.com/150?text=${name.replace(/\s/g, '+')}`;

  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <input
          className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="e.g., Waybill-INV-009.pdf"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md text-sm"
          onClick={() => {
            if (!fileName.trim()) return;
            onUpload({ 
              id: crypto.randomUUID(), 
              name: fileName.trim(), 
              uploadedAt: now(),
              fileUrl: generateFileUrl(fileName.trim())
            });
            setFileName("");
          }}
          disabled={!fileName.trim()}
        >
          Upload
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">Document</th>
              <th className="text-left p-3 font-semibold text-gray-700">Uploaded</th>
              <th className="text-left p-3 font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {items.map((w) => (
              <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-100 transition duration-100">
                <td className="p-3 text-gray-800 truncate max-w-xs">{w.name}</td>
                <td className="p-3 text-gray-500 text-xs">
                  {new Date(w.uploadedAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <ViewFileLink url={w.fileUrl} text="View PDF" />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="3" className="text-gray-500 text-center py-4">
                  No waybills yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Text({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <input
        type={type}
        className="p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <select
        className="p-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormGrid({ children, cols = 3 }) {
  const columnsClass = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
  return <div className={`grid ${columnsClass} gap-4`}>{children}</div>;
}

// --- HEADER COMPONENT -----------------------------------------------------------------

function Header({ user }) {
  // Use username's first word for welcome and initial for avatar
  const displayName = user.username.split('_')[0]; 
  const avatarInitial = user.username.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center p-6 bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
      <h1 className="text-3xl font-light text-gray-700">
        Welcome Back, <span className="font-bold text-indigo-600 capitalize">{displayName}</span>!
      </h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-bold text-lg text-gray-800 capitalize">{user.username}</div>
          <div className={`text-sm font-medium ${user.role === 'admin' ? 'text-red-500' : 'text-gray-500'} capitalize`}>
            {user.role}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl border-2 border-indigo-500">
            {avatarInitial}
        </div>
      </div>
    </header>
  );
}

// --- ADMIN USER MANAGEMENT PANEL (Kept the same) --------------------------------------------

function AdminUserManagement({ users, setUsers }) {
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'driver' });
    const [resetUser, setResetUser] = useState({ id: '', newPassword: '' });
    const roles = ['admin', 'driver', 'owner'];

    const handleCreateUser = () => {
        if (!newUser.username || !newUser.password) return;
        setUsers(prev => [...prev, { id: crypto.randomUUID(), ...newUser }]);
        setNewUser({ username: '', password: '', role: 'driver' });
    };

    const handleResetPassword = () => {
        if (!resetUser.id || !resetUser.newPassword) return;
        setUsers(prev => prev.map(u => 
            u.id === resetUser.id ? { ...u, password: resetUser.newPassword } : u
        ));
        setResetUser({ id: '', newPassword: '' });
    };

    return (
        <Section title="Admin User Management">
            <div className="grid gap-6">
                {/* Create New User */}
                <div className="border border-gray-200 p-4 rounded-xl bg-indigo-50">
                    <h4 className="font-bold text-xl text-indigo-700 mb-4">Create New User Account</h4>
                    <FormGrid cols={4}>
                        <Text label="Username" value={newUser.username} onChange={(v) => setNewUser({ ...newUser, username: v })} />
                        <Text label="Initial Password" value={newUser.password} onChange={(v) => setNewUser({ ...newUser, password: v })} type="password" />
                        <Select label="Role" value={newUser.role} onChange={(v) => setNewUser({ ...newUser, role: v })} options={roles} />
                        <div className="flex items-end">
                            <button
                                onClick={handleCreateUser}
                                disabled={!newUser.username || !newUser.password}
                                className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 disabled:bg-gray-400 shadow-md"
                            >
                                Create User
                            </button>
                        </div>
                    </FormGrid>
                </div>

                {/* Reset Password */}
                <div className="border border-gray-200 p-4 rounded-xl bg-yellow-50">
                    <h4 className="font-bold text-xl text-yellow-700 mb-4">Reset User Password</h4>
                    <FormGrid cols={3}>
                        <Select 
                            label="Select User" 
                            value={resetUser.id} 
                            onChange={(v) => setResetUser({ ...resetUser, id: v })} 
                            options={['', ...users.map(u => u.id)]}
                        />
                        <Text 
                            label="New Password" 
                            value={resetUser.newPassword} 
                            onChange={(v) => setResetUser({ ...resetUser, newPassword: v })} 
                            type="password"
                        />
                         <div className="flex items-end">
                            <button
                                onClick={handleResetPassword}
                                disabled={!resetUser.id || !resetUser.newPassword}
                                className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 disabled:bg-gray-400 shadow-md"
                            >
                                Reset Password
                            </button>
                        </div>
                    </FormGrid>
                </div>

                {/* User List */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left p-3 font-semibold text-gray-700">Username</th>
                                <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                                <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                                <th className="text-left p-3 font-semibold text-gray-700">Password (Simulated)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-100">
                                    <td className="p-3 font-medium text-gray-900">{u.username}</td>
                                    <td className="p-3 text-gray-600 capitalize">{u.role}</td>
                                    <td className="p-3 text-gray-600 text-xs">{u.id}</td>
                                    <td className="p-3 text-red-500 font-mono text-xs">{u.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Section>
    );
}

// --- SIDEBAR COMPONENT (New 'Contact Us' tab added) -----------------------------------------------------------------

const Sidebar = ({ currentTab, setTab }) => { 
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "🏠" },
        { id: "available tracks", label: "Available Tracks", icon: "🚚" },
        { id: "driver", label: "Driver Management", icon: "👨‍💼" },
        { id: "owner", label: "Owner/Purchaser View", icon: "📦" },
        { id: "chat", label: "Messaging/Chat", icon: "💬" },
        { id: "contact", label: "Contact Us", icon: "📞" }, // NEW ITEM
        { id: "admin", label: "Admin Tools", icon: "⚙️" },
    ];

    return (
        <div className="w-64 bg-indigo-800 text-white h-screen p-5 flex flex-col sticky top-0">
            {/* Logo/Title */}
            <div className="font-extrabold text-2xl text-white mb-8 border-b border-indigo-700 pb-4">HeeyLogistic</div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`w-full text-left flex items-center p-3 rounded-lg transition duration-200 ${
                            currentTab === item.id
                                ? "bg-indigo-700 shadow-md font-bold"
                                : "hover:bg-indigo-700/50"
                        } capitalize`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

// --- CHAT COMPONENT (Kept the same) -----------------------------------------------------------------

function Chat({ messages, onSend, drivers, owners, adminUserId }) {
    const [text, setText] = useState("");
    const [selectedRecipientId, setSelectedRecipientId] = useState(null);

    const allRecipients = [
        ...drivers.map(d => ({ id: d.id, name: d.name, type: 'Driver' })),
        ...owners.map(o => ({ id: o.id, name: o.name, type: 'Owner' })),
    ];

    const recipient = allRecipients.find(r => r.id === selectedRecipientId);

    // Filter messages relevant to the current conversation:
    // 1. Messages FROM the selected recipient (to the admin)
    // 2. Messages TO the selected recipient (from the admin)
    // 3. (Simplification) Messages FROM the selected recipient TO another entity, but we show them for context
    const filteredMessages = messages.filter(m => 
        (m.from !== 'admin' && (m.toId === adminUserId || m.from === recipient?.type.toLowerCase())) ||
        (m.from === 'admin' && m.toId === selectedRecipientId)
    ).sort((a, b) => new Date(a.at) - new Date(b.at)); // Sort by time

    const handleSend = () => {
        if (!text.trim() || !selectedRecipientId) return;
        
        // The admin sends the message TO the selected recipient's ID
        onSend({
            id: crypto.randomUUID(), 
            from: "admin", 
            toId: selectedRecipientId, 
            text: text.trim(), 
            at: now()
        });
        setText("");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recipient List */}
            <div className="lg:col-span-1 border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-[700px] overflow-y-auto">
                <h4 className="font-bold text-xl text-gray-800 mb-3 border-b pb-2">Select Recipient</h4>
                {allRecipients.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setSelectedRecipientId(r.id)}
                        className={`w-full text-left p-3 mb-2 rounded-lg transition duration-200 border ${
                            selectedRecipientId === r.id
                                ? "bg-indigo-600 text-white shadow-md border-indigo-700"
                                : "bg-white text-gray-800 hover:bg-gray-100 border-gray-200"
                        }`}
                    >
                        <div className="font-semibold">{r.name}</div>
                        <div className={`text-sm ${selectedRecipientId === r.id ? "text-indigo-200" : "text-gray-500"}`}>{r.type}</div>
                    </button>
                ))}
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 grid gap-4">
                <div className="h-96 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-inner flex flex-col-reverse">
                    {recipient ? (
                        filteredMessages.slice().reverse().map((m) => (
                            <div
                                key={m.id}
                                className={`mb-2 p-3 max-w-[80%] rounded-xl shadow-md ${
                                    m.from === "admin"
                                        ? "ml-auto bg-indigo-500 text-white"
                                        : m.from === "driver"
                                        ? "mr-auto bg-yellow-100 text-gray-800 border border-yellow-200"
                                        : "mr-auto bg-gray-200 text-gray-800 border border-gray-300"
                                }`}
                            >
                                <div className={`text-xs font-semibold mb-0.5 capitalize ${m.from === "admin" ? "text-indigo-100" : "text-gray-600"}`}>
                                    {m.from} · <span className="font-normal text-[10px]">{new Date(m.at).toLocaleTimeString()}</span>
                                </div>
                                <div className="text-sm">{m.text}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center py-4 self-center">
                            Please select a Driver or Owner to start a conversation.
                        </div>
                    )}
                    
                    {filteredMessages.length === 0 && recipient && (
                        <div className="text-gray-500 text-center py-4 self-center">
                            No messages in this conversation yet.
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <input
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder={recipient ? `Message ${recipient.name} (${recipient.type})...` : "Select a recipient first..."}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && text.trim() && selectedRecipientId) {
                                handleSend();
                            }
                        }}
                        disabled={!selectedRecipientId}
                    />
                    <button
                        disabled={!text.trim() || !selectedRecipientId}
                        onClick={handleSend}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400 shadow-md"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- DRIVER LIST COMPONENT (Kept the same) -----------------------------------------------------------------

function DriverList({ drivers, assignStatus, setDrivers }) {

    const getStatusClasses = (status) => {
        switch (status) {
            case 'idle':
                return 'bg-gray-100 text-gray-700';
            case 'custom-reached':
                return 'bg-yellow-100 text-yellow-700';
            case 'purchaser-reached':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };
    
    return (
      <div className="grid gap-6">
        {drivers.map((d) => (
          <div key={d.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition duration-300">
            {/* Header: Driver Info & Status */}
            <div className="flex justify-between items-start flex-wrap gap-4 border-b pb-4 mb-4">
              <div className="flex items-center gap-4">
                <img 
                    src={d.photoUrl} 
                    alt={`${d.name} photo`} 
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500 shadow-md" 
                />
                <div>
                  <div className="font-extrabold text-2xl text-gray-900">{d.name}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-indigo-600">🚚 {d.truckNumber}</span>
                    <span>|</span>
                    <span>📞 {d.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {/* Status Badge */}
                <span className={`px-4 py-1 rounded-full text-sm font-bold capitalize whitespace-nowrap ${getStatusClasses(d.status)} shadow-sm`}>
                  {d.status.replace("-", " ")}
                </span>
                {/* Status Update Dropdown */}
                <select
                  value={d.status}
                  onChange={(e) => assignStatus(d.id, e.target.value)}
                  className="p-2 border border-indigo-300 rounded-lg text-sm bg-indigo-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 cursor-pointer"
                >
                  <option value="idle">Set Idle</option>
                  <option value="custom-reached">Set Customs Reached</option>
                  <option value="purchaser-reached">Set Purchaser Reached</option>
                </select>
              </div>
            </div>

            {/* Body: Documents, Owner, and Waybills */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Documents & Owner Info */}
              <div className="lg:col-span-1 space-y-4">
                <div className="font-bold text-lg text-indigo-700 border-b pb-1">Car Owner & Documents</div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="font-semibold text-gray-800">{d.co_name}</div>
                    <div className="text-sm text-gray-600">{d.co_phone}</div>
                </div>
                
                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Driver License:</div>
                    <div className="pl-2">
                        <ViewFileLink url={d.driverLicenseUrl} text="View Driver License" />
                    </div>
                    <div className="text-sm font-medium text-gray-700 pt-1">Ownership Document:</div>
                    <div className="pl-2">
                        <ViewFileLink url={d.co_ownershipDocUrl} text="View Ownership Doc" />
                    </div>
                </div>
              </div>

              {/* Waybills Widget */}
              <div className="lg:col-span-2">
                <div className="font-bold text-lg text-indigo-700 border-b pb-1 mb-3">Waybills Management</div>
                <WaybillWidget
                  items={d.waybills}
                  onUpload={(w) =>
                    setDrivers((all) => all.map((x) => (x.id === d.id ? { ...x, waybills: [w, ...x.waybills] } : x)))
                  }
                />
              </div>
            </div>
          </div>
        ))}
        {drivers.length === 0 && (
             <div className="text-center p-8 text-gray-500 border border-gray-200 rounded-xl bg-white shadow-lg">
                No drivers registered yet.
             </div>
        )}
      </div>
    );
  }

// --- NEW CONTACT US COMPONENT -----------------------------------------------------------------

function ContactUs() {
    // Contact details provided by the user
    const CONTACT_DETAILS = {
        emails: ["info@heeylogistic.com", "support@heeylogistic.com"],
        phones: ["+251 15151601", "+251 991927628"],
        location: "Addis Ababa, near Daralasam Hotel",
    };

    const contactItemClass = "flex items-start p-4 bg-indigo-50 rounded-lg shadow-sm border border-indigo-200";
    const iconClass = "text-2xl text-indigo-600 mr-4 mt-1";
    const linkClass = "text-indigo-600 hover:text-indigo-800 font-medium transition duration-150";

    return (
        <Section title="Reach Our Customer Support">
            <p className="text-lg text-gray-600 mb-8">
                For immediate assistance, support, or inquiries regarding our logistics services, please use the contact details below.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Email Section */}
                <div className={contactItemClass}>
                    <span className={iconClass}>📧</span>
                    <div>
                        <h4 className="font-bold text-gray-800 text-xl mb-2">Email Support</h4>
                        <div className="space-y-1">
                            {CONTACT_DETAILS.emails.map((email) => (
                                <p key={email}>
                                    <a href={`mailto:${email}`} className={linkClass}>
                                        {email}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Phone Section */}
                <div className={contactItemClass}>
                    <span className={iconClass}>📞</span>
                    <div>
                        <h4 className="font-bold text-gray-800 text-xl mb-2">Phone Numbers</h4>
                        <div className="space-y-1">
                            {CONTACT_DETAILS.phones.map((phone) => (
                                <p key={phone}>
                                    <a href={`tel:${phone.replace(/\s/g, '')}`} className={linkClass}>
                                        {phone}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className={contactItemClass}>
                    <span className={iconClass}>📍</span>
                    <div>
                        <h4 className="font-bold text-gray-800 text-xl mb-2">Our Location</h4>
                        <p className="text-gray-700">
                            {CONTACT_DETAILS.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                             (Addis Ababa, near Daralasam Hotel)
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}

// --- MAIN APP COMPONENT (New 'contact' case added to switch) -----------------------------------------------------------------

export default function App() {
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [users, setUsers] = useState(seedUsers);
  const [tab, setTab] = useState("dashboard"); // Default to dashboard

  const ADMIN_USER_ID = 'u1'; // Assume the admin user ID is 'u1'
  const [messages, setMessages] = useState(seedMessages);
  
  // Find the currently logged-in user (Admin in this demo)
  const currentUser = useMemo(() => users.find(u => u.id === ADMIN_USER_ID), [users]);


  const totals = {
    tracks: tracks.length,
    drivers: drivers.length,
    owners: owners.length,
    availableTracks: tracks.filter((t) => t.isAvailable).length,
  };

  const assignStatus = (driverId, status) => {
    setDrivers((d) => d.map((x) => (x.id === driverId ? { ...x, status } : x)));
  };

  const statCardClass = "p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200";
  const statTitleClass = "text-sm font-medium text-gray-500";
  const statValueClass = "text-4xl font-extrabold text-indigo-600 mt-2";


  // --- Render Functions for different tabs ---
  const renderContent = () => {
    switch (tab) {
        case 'dashboard':
            return (
                <div className="grid gap-6">
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={statCardClass}>
                            <div className={statTitleClass}>Total Tracks</div>
                            <div className={statValueClass}>{totals.tracks}</div>
                        </div>
                        <div className={statCardClass}>
                            <div className={statTitleClass}>Drivers</div>
                            <div className={statValueClass}>{totals.drivers}</div>
                        </div>
                        <div className={statCardClass}>
                            <div className={statTitleClass}>Owners</div>
                            <div className={statValueClass}>{totals.owners}</div>
                        </div>
                        <div className={statCardClass}>
                            <div className={statTitleClass}>Available Tracks</div>
                            <div className="text-4xl font-extrabold text-green-600 mt-2">{totals.availableTracks}</div>
                        </div>
                    </div>
                    {/* Chat removed from dashboard */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <ManageTracks 
                            tracks={tracks.slice(0, 3)} 
                            onToggle={(id) => setTracks((all) => all.map((t) => (t.id === id ? { ...t, isAvailable: !t.isAvailable } : t)))} 
                        />
                    </div>
                </div>
            );
        case 'available tracks':
            return (
                <Section title="Available Tracks (Ready to Assign)">
                    <AvailableTracks tracks={tracks.filter(t => t.isAvailable)} drivers={drivers} />
                </Section>
            );
        case 'driver':
            return (
                <Section title="Driver Management">
                    {/* The re-designed DriverList is used here */}
                    <DriverList drivers={drivers} assignStatus={assignStatus} setDrivers={setDrivers} />
                </Section>
            );
        case 'owner':
            return (
                <Section title="Owner/Purchaser Status View">
                    <OwnerList owners={owners} drivers={drivers} setOwners={setOwners} />
                </Section>
            );
        case 'chat': // NEW CHAT TAB
            const addMessage = (message) => setMessages((m) => [...m, message]);
            return (
                <Section title="Live Messaging (Admin to Driver/Owner)">
                    <Chat 
                        messages={messages} 
                        onSend={addMessage} 
                        drivers={drivers}
                        owners={owners}
                        adminUserId={ADMIN_USER_ID}
                    />
                </Section>
            );
        case 'contact': // NEW CONTACT TAB
            return <ContactUs />;
            
        case 'admin':
            return <AdminPanel 
                        drivers={drivers} 
                        setDrivers={setDrivers} 
                        owners={owners} 
                        setOwners={setOwners} 
                        tracks={tracks} 
                        setTracks={setTracks} 
                        messages={messages} 
                        setMessages={setMessages} 
                        users={users} 
                        setUsers={setUsers} 
                    />;
        default:
            return <div className="p-8 text-gray-500">Select a navigation item.</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
        <Sidebar currentTab={tab} setTab={setTab} />
        
        <main className="flex-1 bg-gray-100 p-8 max-w-5xl mx-auto">
            {/* Header component showing user profile and role */}
            {currentUser && <Header user={currentUser} />}

            {renderContent()}

            <footer className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
                © {new Date().getFullYear()} HeeyLogistic. All rights reserved. • Demo UI
            </footer>
        </main>
    </div>
  );
}

// --- ADMIN PANEL COMPONENT (Kept the same) ----------------------------------------------------

function AdminPanel({ drivers, setDrivers, owners, setOwners, tracks, setTracks, messages, setMessages, users, setUsers }) {
    const [adminTab, setAdminTab] = useState("creation");

    const adminNavItems = [
        { id: "creation", label: "Create Driver & Owner" },
        { id: "tracks", label: "Manage Tracks" },
        { id: "users", label: "User Management" },
    ];

    const renderAdminContent = () => {
        switch (adminTab) {
            case 'creation':
                return (
                    <div className="grid gap-6">
                        <DriverForm onCreate={(d) => {
                            const newDriver = { 
                                id: crypto.randomUUID(), 
                                ...d, 
                                waybills: [], 
                                carOwnerId: crypto.randomUUID()
                            };
                            setDrivers((prev) => [newDriver, ...prev]);

                            setTracks(prev => [...prev, {
                                id: crypto.randomUUID(),
                                plate: d.truckNumber,
                                model: 'Unspecified Model',
                                isAvailable: true,
                                carOwnerId: newDriver.carOwnerId,
                                assignedDriverId: newDriver.id
                            }]);

                            // Optionally create a user for the new driver
                            setUsers(prev => [...prev, { id: crypto.randomUUID(), username: d.name.toLowerCase().replace(/\s/g, '_'), password: 'defaultpassword', role: 'driver' }]);
                        }} />
                        <CreateOwner onCreate={(o) => {
                            setOwners((prev) => [{ id: crypto.randomUUID(), ...o, waybills: [] }, ...prev]);
                            // Optionally create a user for the new owner
                            setUsers(prev => [...prev, { id: crypto.randomUUID(), username: o.name.toLowerCase().replace(/\s/g, '_'), password: 'defaultpassword', role: 'owner' }]);
                        }} />
                    </div>
                );
            case 'tracks':
                return (
                    <div className="grid gap-6"> 
                        <ManageTracks tracks={tracks} onToggle={(id) => setTracks((all) => all.map((t) => (t.id === id ? { ...t, isAvailable: !t.isAvailable } : t)))} />
                        {/* Chat removed from Admin Tracks */}
                    </div>
                );
            case 'users':
                return <AdminUserManagement users={users} setUsers={setUsers} />;
            default:
                return null;
        }
    };

    return (
        <div className="grid gap-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Admin Tools</h2>
            {/* Admin Sub-Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-md border border-gray-200">
                {adminNavItems.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setAdminTab(t.id)}
                        className={`px-4 py-2 text-base font-semibold rounded-lg transition duration-200 ${
                            adminTab === t.id
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-gray-700 hover:bg-gray-100"
                        } capitalize whitespace-nowrap`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            {renderAdminContent()}
        </div>
    );
}


// --- Helper Components (DriverForm, CreateOwner, AvailableTracks, OwnerList, ManageTracks - Kept the same) ---

function DriverForm({ onCreate }) {
    const [f, setF] = useState({ 
      name: "", address: "", phone: "", truckNumber: "", status: "idle",
      driverLicenseUrl: "", photoUrl: "",
      co_name: "", co_phone: "", co_ownershipDocUrl: "" 
    });
    
    const isFormValid = f.name && f.phone && f.truckNumber && f.driverLicenseUrl && f.co_name;
  
    const UrlInput = ({ label, field }) => (
      <Text 
        label={`${label} (URL/Link)`} 
        value={f[field]} 
        onChange={(v) => setF({ ...f, [field]: v })} 
      />
    );
  
    return (
      <Section title="Create New Driver & Car Owner">
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-indigo-700">Driver Details</h4>
          <FormGrid>
            <Text label="Full Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
            <Text label="Address" value={f.address} onChange={(v) => setF({ ...f, address: v })} />
            <Text label="Phone Number" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
            <Text label="Truck Number (Plate)" value={f.truckNumber} onChange={(v) => setF({ ...f, truckNumber: v })} />
            <UrlInput label="Driver Photo" field="photoUrl" />
            <UrlInput label="Driver License Document" field="driverLicenseUrl" />
            <Select label="Initial Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={["idle","custom-reached","purchaser-reached"]} />
          </FormGrid>
  
          <h4 className="text-lg font-bold text-indigo-700 pt-4 border-t border-gray-100">Car Owner Details</h4>
          <FormGrid>
            <Text label="Car Owner Name" value={f.co_name} onChange={(v) => setF({ ...f, co_name: v })} />
            <Text label="Car Owner Phone" value={f.co_phone} onChange={(v) => setF({ ...f, co_phone: v })} />
            <UrlInput label="Car Ownership Document" field="co_ownershipDocUrl" />
          </FormGrid>
        </div>
  
        <div className="text-right mt-6">
          <button
            onClick={() => { 
              isFormValid && onCreate(f); 
              setF({ 
                name: "", address: "", phone: "", truckNumber: "", status: "idle",
                driverLicenseUrl: "", photoUrl: "",
                co_name: "", co_phone: "", co_ownershipDocUrl: ""
              }); 
            }}
            disabled={!isFormValid}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400 shadow-md"
          >
            Register Driver & Owner
          </button>
        </div>
      </Section>
    );
  }
  
  function CreateOwner({ onCreate }) {
    const [f, setF] = useState({ name: "", location: "", phone: "" });
    const isFormValid = f.name && f.location && f.phone;
  
    return (
      <Section title="Create New Owner (Purchaser)">
        <FormGrid cols={2}>
          <Text label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Text label="Location" value={f.location} onChange={(v) => setF({ ...f, location: v })} />
          <Text label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
        </FormGrid>
        <div className="text-right mt-6">
          <button
            onClick={() => { isFormValid && onCreate(f); setF({ name: "", location: "", phone: "" }); }}
            disabled={!isFormValid}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400 shadow-md"
          >
            Add Owner
          </button>
        </div>
      </Section>
    );
  }
  
  function AvailableTracks({ tracks }) {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">Plate Number</th>
              <th className="text-left p-3 font-semibold text-gray-700">Model</th>
              <th className="text-left p-3 font-semibold text-gray-700">Assigned Driver</th>
              <th className="text-left p-3 font-semibold text-gray-700">Owner Phone</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-green-50 transition duration-100">
                <td className="p-3 font-medium text-gray-900">{t.plate}</td>
                <td className="p-3 text-gray-600">{t.model ?? "—"}</td>
                <td className="p-3 text-gray-600">{t.assignedDriverId ? "Assigned" : "Unassigned"}</td>
                <td className="p-3 text-gray-600">N/A (See Driver Details)</td>
              </tr>
            ))}
            {tracks.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No available tracks right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  function OwnerList({ owners, drivers, setOwners }) {
    const latestDriverStatus = drivers.find(d => d.status !== 'idle')?.status || drivers[0]?.status || 'no driver assigned';
  
    return (
      <div className="grid gap-6">
        {owners.map((o) => (
          <div key={o.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
            <div className="flex justify-between items-start flex-wrap gap-4 border-b pb-4 mb-4">
              <div>
                <div className="font-bold text-xl text-gray-900">{o.name}</div>
                <div className="text-sm text-gray-500 mt-1">{o.location} · {o.phone}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-2 font-semibold">Latest Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${latestDriverStatus.includes('reached') ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
                  {latestDriverStatus.replace("-", " ")}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="font-semibold text-lg mb-3 text-gray-700">Waybills Uploaded</div>
              <WaybillWidget
                items={o.waybills}
                onUpload={(w) =>
                  setOwners((all) => all.map((x) => (x.id === o.id ? { ...x, waybills: [w, ...x.waybills] } : x)))
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  
  function ManageTracks({ tracks, onToggle }) {
    return (
      <Section title="Manage Tracks Availability">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700">Plate</th>
                <th className="text-left p-3 font-semibold text-gray-700">Model</th>
                <th className="text-left p-3 font-semibold text-gray-700">Available</th>
                <th className="text-left p-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-100 transition duration-100">
                  <td className="p-3 font-medium text-gray-900">{t.plate}</td>
                  <td className="p-3 text-gray-600">{t.model ?? "—"}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.isAvailable ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onToggle(t.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition duration-150 shadow-sm ${t.isAvailable ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      {t.isAvailable ? "Set Unavailable" : "Set Available"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    );
  }