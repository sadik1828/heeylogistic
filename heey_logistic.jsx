import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Send, CheckCheck, Truck, User, Users, MessageSquare, FileUp, Eye, Shield } from "lucide-react";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type Waybill = { id: string; name: string; url?: string; uploadedAt: string };
export type Driver = {
  id: string;
  name: string;
  address: string;
  driverLicense: string;
  truckNumber: string;
  phone: string;
  photoUrl?: string;
  waybills: Waybill[];
  status: "idle" | "custom-reached" | "purchaser-reached";
  carOwnerId?: string; // relation
};

export type CarOwner = {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  ownershipDocUrl?: string;
};

export type Owner = {
  id: string;
  name: string;
  location: string;
  phone: string;
  waybills: Waybill[];
  // can view status of their assigned driver/track
};

export type Track = {
  id: string;
  plate: string; // car/truck identifier
  model?: string;
  isAvailable: boolean;
  carOwnerId?: string;
  assignedDriverId?: string;
};

type Message = {
  id: string;
  from: "driver" | "owner" | "admin";
  text: string;
  at: string;
};

// ------------------------------------------------------------
// Mock Store (replace with your API later)
// ------------------------------------------------------------
const seedDrivers: Driver[] = [
  {
    id: "d1",
    name: "Ahmed Ali",
    address: "Hargeisa, Togdheer Rd",
    driverLicense: "DL-12345-SL",
    truckNumber: "SL-TRK-9921",
    phone: "+25263 555 1122",
    status: "idle",
    waybills: [],
    carOwnerId: "co1",
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    driverLicense: "DL-98431-SL",
    truckNumber: "SL-TRK-4410",
    phone: "+25263 777 9010",
    status: "custom-reached",
    waybills: [{ id: "w1", name: "Waybill-INV-009.pdf", uploadedAt: new Date().toISOString() }],
    carOwnerId: "co2",
  },
];

const seedCarOwners: CarOwner[] = [
  { id: "co1", name: "Mahad Transport Co.", phone: "+25263 500 1111", ownershipDocUrl: "" },
  { id: "co2", name: "Sahal Logistics", phone: "+25263 500 2222" },
];

const seedOwners: Owner[] = [
  { id: "o1", name: "Abdi Buyer", location: "Hargeisa Market", phone: "+25263 600 1010", waybills: [] },
  { id: "o2", name: "Zahra Import", location: "Borama", phone: "+25263 600 2020", waybills: [] },
];

const seedTracks: Track[] = [
  { id: "t1", plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, carOwnerId: "co1", assignedDriverId: "d1" },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: false, carOwnerId: "co2", assignedDriverId: "d2" },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2" },
];

// ------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------
const fmt = (n: number) => new Intl.NumberFormat().format(n);
const now = () => new Date().toISOString();

// ------------------------------------------------------------
// Dashboard Cards
// ------------------------------------------------------------
function StatCard({ title, value, icon }: { title: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// Available Tracks (public/owner view)
// ------------------------------------------------------------
function AvailableTracks({ tracks, carOwners }: { tracks: Track[]; carOwners: CarOwner[] }) {
  const available = tracks.filter((t) => t.isAvailable);
  const ownerById = useMemo(() => Object.fromEntries(carOwners.map((o) => [o.id, o])), [carOwners]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5"/>Available Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Car Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {available.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.plate}</TableCell>
                <TableCell>{t.model ?? "—"}</TableCell>
                <TableCell>{t.carOwnerId ? ownerById[t.carOwnerId]?.name : "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Available</Badge>
                </TableCell>
              </TableRow>
            ))}
            {available.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No available tracks right now.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// Forms
// ------------------------------------------------------------
function DriverForm({ onSubmit }: { onSubmit: (d: Partial<Driver>) => void }) {
  const [form, setForm] = useState<Partial<Driver>>({ status: "idle" });
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/>Create Driver</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Driver full name" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
          </div>
          <div>
            <Label>Driver License</Label>
            <Input value={form.driverLicense || ""} onChange={(e) => setForm({ ...form, driverLicense: e.target.value })} placeholder="DL-XXXXX" />
          </div>
          <div>
            <Label>Truck Number</Label>
            <Input value={form.truckNumber || ""} onChange={(e) => setForm({ ...form, truckNumber: e.target.value })} placeholder="SL-TRK-0000" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252.." />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Driver["status"] })}>
              <SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="custom-reached">Custom reached</SelectItem>
                <SelectItem value="purchaser-reached">Purchaser reached</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSubmit(form)} className="gap-2"><Plus className="h-4 w-4"/>Save Driver</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OwnerForm({ onSubmit }: { onSubmit: (o: Partial<Owner>) => void }) {
  const [form, setForm] = useState<Partial<Owner>>({ waybills: [] });
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>Create Owner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSubmit(form)} className="gap-2"><Plus className="h-4 w-4"/>Save Owner</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CarOwnerForm({ onSubmit }: { onSubmit: (o: Partial<CarOwner>) => void }) {
  const [form, setForm] = useState<Partial<CarOwner>>({});
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5"/>Create Car Owner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Ownership Document (URL)</Label>
            <Input value={form.ownershipDocUrl || ""} onChange={(e) => setForm({ ...form, ownershipDocUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSubmit(form)} className="gap-2"><Plus className="h-4 w-4"/>Save Car Owner</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// Waybill upload / list (in-memory demo)
// ------------------------------------------------------------
function WaybillWidget({ items, onUpload }: { items: Waybill[]; onUpload: (w: Waybill) => void }) {
  const [fileName, setFileName] = useState("");
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Waybill file name</Label>
          <Input placeholder="Waybill-123.pdf" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </div>
        <Button onClick={() => { if (!fileName) return; onUpload({ id: crypto.randomUUID(), name: fileName, uploadedAt: now() }); setFileName(""); }} className="gap-2">
          <FileUp className="h-4 w-4"/>Upload
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((w) => (
            <TableRow key={w.id}>
              <TableCell>{w.name}</TableCell>
              <TableCell>{new Date(w.uploadedAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="secondary" size="sm" className="gap-2"><Eye className="h-4 w-4"/>View</Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">No waybills yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ------------------------------------------------------------
// Chat (Driver ↔ Owner, Admin can view)
// ------------------------------------------------------------
function ChatPanel({ threadWithNames, messages, onSend }: { threadWithNames: string; messages: Message[]; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <Card className="rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5"/>Chat · {threadWithNames}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex-1 overflow-auto rounded-lg border p-3 space-y-3 bg-muted/30">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "owner" ? "justify-start" : m.from === "driver" ? "justify-end" : "justify-center"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.from === "owner" ? "bg-white border" : m.from === "driver" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                <div className="opacity-70 text-xs mb-1 capitalize">{m.from}</div>
                <div>{m.text}</div>
                <div className="opacity-50 text-[10px] mt-1">{new Date(m.at).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <div className="text-center text-muted-foreground">No messages yet.</div>}
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { onSend(text.trim()); setText(""); } }} />
          <Button disabled={!text.trim()} onClick={() => { onSend(text.trim()); setText(""); }} className="gap-2"><Send className="h-4 w-4"/>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// Admin – Manage Tracks availability
// ------------------------------------------------------------
function ManageTracks({ tracks, onToggle }: { tracks: Track[]; onToggle: (id: string) => void }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5"/>Manage Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.plate}</TableCell>
                <TableCell>{t.model ?? "—"}</TableCell>
                <TableCell>{t.isAvailable ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => onToggle(t.id)}>Toggle</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------
// Main App (role-based tabs)
// ------------------------------------------------------------
export default function HeeyLogisticApp() {
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [owners, setOwners] = useState<Owner[]>(seedOwners);
  const [carOwners, setCarOwners] = useState<CarOwner[]>(seedCarOwners);
  const [tracks, setTracks] = useState<Track[]>(seedTracks);

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", from: "owner", text: "Driver on the way?", at: now() },
    { id: "m2", from: "driver", text: "Yes, 10 minutes out.", at: now() },
  ]);

  const totals = useMemo(() => ({
    tracks: tracks.length,
    drivers: drivers.length,
    owners: owners.length + carOwners.length,
    availableTracks: tracks.filter((t) => t.isAvailable).length,
  }), [tracks, drivers, owners, carOwners]);

  const assignStatus = (driverId: string, status: Driver["status"]) => {
    setDrivers((d) => d.map((x) => (x.id === driverId ? { ...x, status } : x)));
  };

  return (
    <div className="min-h-dvh p-4 md:p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src=""/><AvatarFallback>HL</AvatarFallback></Avatar>
          <div>
            <div className="text-xl font-semibold">HeeyLogistic</div>
            <div className="text-xs text-muted-foreground">Logistics hub · React single-file demo</div>
          </div>
        </div>
        <Badge variant="outline">Vercel-ready</Badge>
      </header>

      {/* Dashboard */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Tracks" value={fmt(totals.tracks)} icon={<Truck className="h-5 w-5 opacity-60"/>} />
          <StatCard title="Available" value={fmt(totals.availableTracks)} icon={<CheckCheck className="h-5 w-5 opacity-60"/>} />
          <StatCard title="Drivers" value={fmt(totals.drivers)} icon={<User className="h-5 w-5 opacity-60"/>} />
          <StatCard title="Owners" value={fmt(totals.owners)} icon={<Users className="h-5 w-5 opacity-60"/>} />
        </div>
      </section>

      <Tabs defaultValue="public" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="public">Available Tracks</TabsTrigger>
          <TabsTrigger value="driver">Driver</TabsTrigger>
          <TabsTrigger value="owner">Owner</TabsTrigger>
          <TabsTrigger value="car-owner">Car Owner</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        {/* PUBLIC / OWNER view: list available tracks */}
        <TabsContent value="public" className="space-y-6">
          <AvailableTracks tracks={tracks} carOwners={carOwners} />
        </TabsContent>

        {/* DRIVER view: update status + waybills */}
        <TabsContent value="driver" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Driver Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {drivers.map((d) => (
                <div key={d.id} className="rounded-xl border p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-medium">{d.name} · {d.truckNumber}</div>
                      <div className="text-xs text-muted-foreground">{d.phone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={d.status === "idle" ? "secondary" : "default"} className="capitalize">{d.status.replace("-", " ")}</Badge>
                      <Select value={d.status} onValueChange={(v) => assignStatus(d.id, v as Driver["status"]) }>
                        <SelectTrigger className="w-[220px]"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idle">Idle</SelectItem>
                          <SelectItem value="custom-reached">Custom reached</SelectItem>
                          <SelectItem value="purchaser-reached">Purchaser reached</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Waybills</div>
                    <WaybillWidget items={d.waybills} onUpload={(w) => setDrivers((all) => all.map((x) => x.id === d.id ? { ...x, waybills: [w, ...x.waybills] } : x))} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* OWNER view: upload & view their waybills and see statuses */}
        <TabsContent value="owner" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Owner Waybills & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {owners.map((o) => (
                <div key={o.id} className="rounded-xl border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{o.name}</div>
                      <div className="text-xs text-muted-foreground">{o.location} · {o.phone}</div>
                    </div>
                    {/* A simple status glance (from any assigned driver with matching waybill/logic) – demo */}
                    <div className="text-sm">
                      <span className="opacity-70">Latest status:</span>{" "}
                      <Badge> {drivers[0]?.status.replace("-", " ")}</Badge>
                    </div>
                  </div>

                  <WaybillWidget items={o.waybills} onUpload={(w) => setOwners((all) => all.map((x) => x.id === o.id ? { ...x, waybills: [w, ...x.waybills] } : x))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CAR OWNER view: maintain car owner profile & docs */}
        <TabsContent value="car-owner" className="space-y-6">
          <CarOwnerForm onSubmit={(o) => {
            const newItem: CarOwner = { id: crypto.randomUUID(), name: o.name || "Unnamed", phone: o.phone || "", ownershipDocUrl: o.ownershipDocUrl };
            setCarOwners((prev) => [newItem, ...prev]);
          }} />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Car Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Ownership Doc</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carOwners.map((co) => (
                    <TableRow key={co.id}>
                      <TableCell className="font-medium">{co.name}</TableCell>
                      <TableCell>{co.phone}</TableCell>
                      <TableCell>
                        {co.ownershipDocUrl ? (
                          <a href={co.ownershipDocUrl} target="_blank" rel="noreferrer" className="text-primary underline">View</a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADMIN */}
        <TabsContent value="admin" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Create entities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DriverForm onSubmit={(d) => setDrivers((prev) => [{ id: crypto.randomUUID(), name: d.name || "Unnamed", address: d.address || "", driverLicense: d.driverLicense || "", truckNumber: d.truckNumber || "", phone: d.phone || "", status: (d.status || "idle"), waybills: [], carOwnerId: undefined }, ...prev])} />
                <OwnerForm onSubmit={(o) => setOwners((prev) => [{ id: crypto.randomUUID(), name: o.name || "Unnamed", location: o.location || "", phone: o.phone || "", waybills: [] }, ...prev])} />
              </div>

              {/* Manage Tracks */}
              <ManageTracks tracks={tracks} onToggle={(id) => setTracks((all) => all.map((t) => t.id === id ? { ...t, isAvailable: !t.isAvailable } : t))} />
            </div>

            {/* Chat */}
            <div className="xl:col-span-1">
              <ChatPanel
                threadWithNames={`${owners[0]?.name ?? "Owner"} ↔ ${drivers[0]?.name ?? "Driver"}`}
                messages={messages}
                onSend={(text) => setMessages((m) => [...m, { id: crypto.randomUUID(), from: "admin", text, at: now() }])}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="pt-4 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} HeeyLogistic • Demo UI. Replace mock store with real API when ready.
      </footer>
    </div>
  );
}
