"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slider } from "@/components/ui/slider";

const Home: React.FC = () => {
  const [serverName, setServerName] = useState<string>("");
  const [serverAddress, setServerAddress] = useState<string>("");
  const [pingLimit, setPingLimit] = useState<number>(2500); // Initial ping limit

  useEffect(() => {
    const savedServerName = localStorage.getItem("name");
    const savedServerAddress = localStorage.getItem("url");
    const savedPingLimit = localStorage.getItem("pinglimit");

    if (savedServerName) {
      setServerName(savedServerName);
    }
    if (savedServerAddress) {
      setServerAddress(savedServerAddress);
    }
    if (savedPingLimit) {
      setPingLimit(Number(savedPingLimit));
    }
  }, []);

  const handleSave = () => {
    if (!serverName || !serverAddress) {
      toast.error("please fill in both server name and server address.");
      return;
    }

    if (
      !serverAddress.startsWith("http://") &&
      !serverAddress.startsWith("https://")
    ) {
      toast.error("server address must start with http:// or https://");
      return;
    }

    localStorage.setItem("name", serverName);
    localStorage.setItem("url", serverAddress);
    toast.success(`saved! redirecting to main page.`);
    window.location.href = "/main_th";
  };

  useEffect(() => {
    localStorage.setItem("pinglimit", pingLimit.toString());
  }, [pingLimit]);

  const handlePingLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove any non-digit characters
    setPingLimit(Number(value));
  };

  return (
    <main className="thai">
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

      <Link href="/">
        <div className="absolute top-0 right-0 m-2 ">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span className="">เปลี่ยนภาษา</span>
          </Button>
        </div>
      </Link>

      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">การตั้งค่า</CardTitle>
            <CardDescription>
              <span className="text-sm text-red-400 text-balance">
                โปรดระบุโปรโตคอล (http/https) และหมายเลขพอร์ต (ถ้าจำเป็น)
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serverName">ชื่อเว็บไซต์</Label>
              <Input
                autoComplete="off"
                id="serverName"
                type="text"
                placeholder="เว็บไซต์ของฉัน"
                value={serverName ? serverName.toString() : ""}
                onChange={(e) => setServerName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serverAddress">ที่อยู่เว็บไซต์</Label>
              <Input
                autoComplete="off"
                id="serverAddress"
                type="text"
                placeholder="https://example.com"
                value={serverAddress ? serverAddress.toString() : ""}
                onChange={(e) => setServerAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pinglimit">ขีดจำกัดการ Ping (ในมิลลิวินาที)</Label>
              <Input
                autoComplete="off"
                id="pinglimit"
                type="text"
                placeholder="2500"
                value={pingLimit ? pingLimit.toString() : ""}
                onChange={handlePingLimitChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-sm text-center" onClick={handleSave}>
              บันทึก
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Home;
