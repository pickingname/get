"use client";

{
  /* imports */
}
import { ModeToggle } from "@/components/ui/themechanger";

import Image from "next/image";
import { Loader2, Tornado } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Gauge } from "lucide-react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  HomeIcon,
} from "lucide-react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { overrideGlobalXHR } from "tauri-xhr";
import axios from "axios";

let initialFirstOffline = false;
let initialFirstOnline = true;
const appstarttime = new Date().toLocaleString() + "";

const Home: React.FC = () => {
  const [websitename, setwebsitename] = useState<string>('example website');
  const [websiteurl, setwebsiteurl] = useState<string>('http://localhost:1234');
  const [inputtedwebsitename, setinputtedwebsitename] = useState<string>('');
  const [inputtedwebsiteurl, setinputtedwebsiteurl] = useState<string>('');
  const [online, setOnline] = useState<boolean>(false);
  const [ping, setPing] = useState<number>(0);
  const [pingPercentage, setPingPercentage] = useState<number>(0);
  const [statuscode, setstatuscode] = useState<number>(0);
  const [statustext, setstatustext] = useState<string>("unknown");
  const [fetching, setFetching] = useState<boolean>(true);
  const [pingHistory, setPingHistory] = useState<
    Array<{ ping: number; status: string; date: string }>
  >([]);
  const [attempts, setAttempts] = useState<number>(1);
  const [pingChanges, setPingChanges] = useState<Array<number>>([]);
  const [lastTenPingValues, setLastTenPingValues] = useState<number[]>([]);
  const [webtype, setWebtype] = useState<string>("unknown");
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [ip, setIP] = useState("");
  const [totalonline, settotalonline] = useState<number>(0);
  const [totaloffline, settotaloffline] = useState<number>(0);
  let donotifyonhighpingusage = true;

  useEffect(() => {
    setwebsitename(inputtedwebsitename);
    setwebsiteurl(inputtedwebsiteurl);
  }, [inputtedwebsitename, inputtedwebsiteurl]);

  useEffect(() => {
    setwebsitename(websitename);
    setwebsiteurl(websiteurl);
    getData();
    overrideGlobalXHR();
    let webtype = "not yet acquired";

    if (websiteurl.startsWith("http://")) {
      setWebtype("http");
    } else if (websiteurl.startsWith("https://")) {
      setWebtype("https");
    } else {
      setWebtype("unknown");
    }

    const checkStatus = async () => {
      try {
        setwebsitename(websitename);
        setwebsiteurl(websiteurl);
        setTotalRequests(prevTotal => prevTotal + 1);

        let startTime = Date.now();
        let res = await axios.get(websiteurl);
        let endTime = Date.now();

        setstatuscode(res.status);
        setstatustext(res.statusText);
        setOnline(true);
        settotalonline(prevTotal => prevTotal + 1);

        if (initialFirstOnline) {
          toast.success("website is online");
          new Audio(
            "https://pickingname.github.io/datastores/get/sounds/yes.mp3"
          ).play();
          initialFirstOffline = true;
          initialFirstOnline = false;
        }

        let currentPing = endTime - startTime;
        setPing(currentPing);

        let percentage = Math.min(
          (currentPing / parseInt(pinglimit)) * 100,
          100
        );
        setPingPercentage(Number(percentage.toFixed(to_round)));

        if (pingHistory.length > 0) {
          let lastPing = pingHistory[0].ping;
          let change = ((currentPing - lastPing) / lastPing) * 100;
          setPingChanges(prevChanges => [change, ...prevChanges.slice(0, 4)]);
        }

        setPingHistory(prevHistory => [
          {
            ping: currentPing,
            status: "online",
            date: new Date().toLocaleString(),
          },
          ...prevHistory.slice(0, 4),
        ]);

        setLastTenPingValues(prevValues => [
          currentPing,
          ...prevValues.slice(0, averagepingvaluetoget),
        ]);
        setFetching(false);
      } catch (error) {
        settotaloffline(prevTotal => prevTotal + 1);
        setOnline(false);
        setstatuscode(408);
        setstatustext("server cannot be reached");

        if (totaloffline > 5 ) {
          if (donotifyonhighpingusage == true) {
            toast.warning("offline for more than 3 minutes!!");
            new Audio(
              "https://pickingname.github.io/datastores/get/sounds/level_3.mp3"
            ).play();
          }
        }

        if (initialFirstOffline) {
          toast.error("website is offline");
          new Audio(
            "https://pickingname.github.io/datastores/get/sounds/no.mp3"
          ).play();
          initialFirstOffline = false;
          initialFirstOnline = true;
        }
        setOnline(false);
        setPing(0);
        setPingPercentage(0);
        setFetching(false);

        setPingHistory(prevHistory => [
          { ping: 0, status: "offline", date: new Date().toLocaleString() },
          ...prevHistory.slice(0, 4),
        ]);
      }
    };

    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    setIP(res.data.ip);
  };

  const updatetarget = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent default form submission behavior

    setwebsitename(inputtedwebsitename);
    setwebsiteurl(inputtedwebsiteurl);
  };

  const secstotime = (seconds: number) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  };

  let averagepingvaluetogetRAW = 10;
  let to_round = 1;
  let averagepingvaluetoget = averagepingvaluetogetRAW - 1;

  let pinglimit = "2000";
  const thumblink = "https://www.google.com/s2/favicons?domain=" + websitename;

  let averagePing =
    lastTenPingValues.reduce((acc, curr) => acc + curr, 0) /
    lastTenPingValues.length;

  return (
    <main className="font-outfit">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {" "}
        {/* main */}
        <div className="flex flex-col sm:gap-4 sm:py-4">
          {" "}
          {/* main div */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {" "}
            {/* header that contains the breadcrumbs, search, and user profile */}
            {/* <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-foreground"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Package className="h-5 w-5" />
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Users2 className="h-5 w-5" />
                    Customers
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <LineChart className="h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet> */}
            <Breadcrumb className="flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <BreadcrumbPage>dash</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <BreadcrumbPage>{websitename}</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{websiteurl}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0">
              {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="another website"
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              /> */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <div
                    className={
                      online
                        ? " w-full h-full bg-green-500 animate-pulse motion-safe:animate-none"
                        : " w-full h-full bg-red-500 animate-pulse motion-safe:animate-none"
                    }
                  ></div>
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            {" "}
            {/* main dashboard that contains the blocks and grids */}
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              {" "}
              {/* all of the blocks are contained here, except reciept card */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {" "}
                {/* top row cards (fetcher, ping, avgms) */}
                <Card
                  className="sm:col-span-2 shadow-lg"
                  x-chunk="dashboard-05-chunk-0"
                >
                  <CardHeader className="pb-3">
                    <CardTitle>fetcher</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      currently getting data from {websiteurl}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    {/* Render different buttons based on the fetching state */}
                    {fetching ? (
                      <Button disabled className="shadow-lg">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        please wait while we make the first request
                      </Button>
                    ) : (
                      <Button
                        variant={online ? "default" : "destructive"}
                        className="shadow-lg"
                      >
                        website is {online ? "online" : "offline"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-1" className="shadow-lg">
                  {!fetching && (
                    <div>
                      <CardHeader className="pb-2">
                        <CardDescription>
                          {" "}
                          {online ? "online" : "offline"}
                        </CardDescription>
                        <CardTitle className="text-4xl">{ping}ms </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">
                          thats {pingPercentage}% of the limit ({pinglimit}ms)
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Progress
                          value={pingPercentage}
                          aria-label="25% increase"
                        />
                      </CardFooter>
                    </div>
                  )}
                </Card>
                <Card x-chunk="dashboard-05-chunk-2" className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardDescription>average ping</CardDescription>{" "}
                    {/* uses the raw value */}
                    <CardTitle className="text-4xl">
                      {isNaN(averagePing) ? "0" : averagePing.toFixed(0)}ms
                    </CardTitle>{" "}
                    {/* no dots */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      in the last {averagepingvaluetogetRAW} requests
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* <Progress value={12} aria-label="12% increase" /> */}
                  </CardFooter>
                </Card>
              </div>
              <Tabs defaultValue="week">
                {" "}
                {/* tabs that contain the lists */}
                {/* <div className="flex items-center">
                  <TabsList className="shadow-sm">
                    <TabsTrigger value="week">1</TabsTrigger>
                    <TabsTrigger value="month">2</TabsTrigger>
                    <TabsTrigger value="year">3</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-sm shadow-sm"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          fullfilled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>dec</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>ref</DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-sm shadow-sm"
                    >
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">export</span>
                    </Button>
                  </div>
                </div> */}
                <TabsContent value="week">
                  <Card x-chunk="dashboard-05-chunk-3" className="shadow-lg">
                    <CardHeader className="px-7">
                      <CardTitle>ping history</CardTitle>
                      <CardDescription>
                        recent pings from this app
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>request</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              ping
                            </TableHead>
                            {/* <TableHead className="hidden sm:table-cell">
                              incre / decre
                            </TableHead> */}
                            <TableHead className="hidden md:table-cell">
                              time
                            </TableHead>
                            <TableHead className="text-right">status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pingHistory.map((entry, index) => (
                            <TableRow
                              key={index}
                              className={
                                entry.status === "offline" ? "bg-accent" : ""
                              }
                            >
                              <TableCell>
                                <div className="font-medium">{websitename}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {websiteurl}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {entry.ping}ms
                              </TableCell>
                              {/* <TableCell className="hidden sm:table-cell"></TableCell> */}
                              <TableCell className="hidden md:table-cell">
                                {entry.date}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  className="text-xs"
                                  variant={
                                    entry.status === "offline"
                                      ? "destructive"
                                      : "outline"
                                  }
                                >
                                  {entry.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              {" "}
              {/* order card */}
              <Card
                className="overflow-hidden shadow-lg"
                x-chunk="dashboard-05-chunk-4"
              >
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      {websitename}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">change theme</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>{websiteurl}</CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Track Order
                      </span>
                    </Button> */}

                    {/* <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <Gauge className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>debug panel</AlertDialogTitle>
                          <AlertDialogDescription>
                            debug content
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}

                    <ModeToggle />
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">website details</div>
                    <ul className="grid gap-3">
                      {/*<li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Glimmer Lamps x <span>2</span>
                        </span>}
                        <span>$250.00</span>
                      </li>*/}
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">status</span>
                        <span
                          className={online ? "text-green-600" : "text-red-00"}
                        >
                          {online ? "online" : "offline"}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          status code
                        </span>
                        <span>{statuscode}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">ping</span>
                        <span>{ping}ms</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">protocol</span>
                        <span>{webtype}</span>
                      </li>
                    </ul>
                    {/* <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>$299.00</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$5.00</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>$25.00</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>$329.00</span>
                      </li>
                    </ul> */}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <div className="font-semibold">uptime</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        {totalonline ? secstotime(totalonline) : "0 seconds"}
                      </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                      <div className="font-semibold">downtime</div>
                      <div className="text-muted-foreground">
                        {totaloffline ? secstotime(totaloffline) : "0 seconds"}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">application information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">start date</dt>
                        <dd suppressHydrationWarning>{appstarttime}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">
                          total requests
                        </dt>
                        <dd>
                          <a>{totalRequests}</a>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between font-outfit">
                        <dt className="text-muted-foreground">device ip</dt>
                        <dd>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <span className="underline underline-offset-2">
                                click to view
                              </span>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  <span className="font-outfit">
                                    current device ip
                                  </span>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <span className="font-mono text-4xl">
                                    {ip}
                                  </span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">about</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <p>
                            <a
                              href="https://github.com/pickingname/get"
                              className="text-blue-400 underline underline-offset-2"
                            >
                              get.app
                            </a>{" "}
                            v1.0.0-pre-1 revision n°4
                          </p>
                        </dt>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                {/*<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                  </div>
                  <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <Button size="icon" variant="outline" className="h-6 w-6">
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="sr-only">Previous Order</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button size="icon" variant="outline" className="h-6 w-6">
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span className="sr-only">Next Order</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                    </CardFooter>*/}
              </Card>
              <div className="">
                <Card className="mt-10 overflow-hidden shadow-lg rounded-lg border bg-card text-card-foreground">
                  <CardHeader className="">
                    <CardTitle className="text-2xl">config</CardTitle>
                    <CardDescription>
                      enter the details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="websitename">website name</Label>
                      <Input
                        id="websitename"
                        type="text"
                        placeholder="my website"
                        value={inputtedwebsitename}
                        onChange={(e) => setinputtedwebsitename(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="websiteurl">website url</Label>
                      <Input
                        id="websiteurl"
                        type="url"
                        placeholder="https://google.com"
                        value={inputtedwebsiteurl}
                        onChange={(e) => setinputtedwebsiteurl(e.target.value)}
                        autoComplete="off"
                        required
                      />
                      <span className="text-sm pb-5">
                        also include http:// or https:// in your website
                        address
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={updatetarget} >
                      get status
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}

export default Home;