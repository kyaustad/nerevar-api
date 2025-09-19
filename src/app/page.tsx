"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Code,
  Database,
  Zap,
  Globe,
  Download,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitchButton } from "@/features/theme-button/components/theme-switch-button";

export default function Home() {
  return (
    <div className="min-h-screen paper-texture relative">
      <ThemeSwitchButton className="fixed top-4 right-4 z-10" />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with torn paper effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-sidebar-primary/20 to-secondary/75" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo and Title */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src="/logo.webp"
                  alt="Nerevar Logo"
                  width={120}
                  height={120}
                  className="animate-float"
                />
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl animate-glow" />
              </div>
              <h1 className="text-6xl md:text-8xl font-sovngarde-bold gradient-text animate-slide-up">
                Nerevar
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-sovngarde animate-slide-up">
                {`The Elder Scrolls III: Morrowind Multiplayer Manager`}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Link
                href="https://github.com/kyaustad/Nerevar/releases"
                target="_self"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="hover-lift text-foreground "
                  // onClick={() => {
                  //   window.open(
                  //     "https://github.com/kyaustad/Nerevar/releases",
                  //     "_self"
                  //   );
                  // }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Nerevar
                </Button>
              </Link>

              <Link
                href="https://github.com/kyaustad/nerevar-api"
                target="_self"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="hover-lift"
                  // onClick={() => {
                  //   window.open("https://github.com/kyaustad/Nerevar", "_self");
                  // }}
                >
                  <Code className="mr-2 h-5 w-5" />
                  View API Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sovngarde-bold mb-4">
              The Easiest Way to Play Tes3MP
            </h2>
            <div className="w-full h-full max-w-2xl mx-auto roudned-xl overflow-hidden">
              <video
                src="/nerevar-install.webm"
                autoPlay
                loop
                muted
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sovngarde-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to experience Morrowind in multiplayer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* OpenMW Integration */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    OpenMW Integration
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Seamless integration with OpenMW for easy setup of your
                  gameplay experience`}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Multiplayer Server */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    Server Management
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Easily edit your Tes3Mp server configuration, settings, and data files`}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Mod Management */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    {`Server Scripts - (Coming Soon)`}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Easily access and publish your server scripts, or add new ones to your server`}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    Mod Packs
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Manage Wabbajack mod packs for your server or client with ease.`}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    Auto Updating
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Automatically update your Tes3MP version or the Nerevar app itself`}
                </CardDescription>
              </CardContent>
            </Card>

            {/* API Access */}
            <Card className="torn-paper hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-sovngarde text-xl">
                    Open Source
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {`Nerevar and its API are 100% open source and free to use, with a GPLv3 License.`}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                {/* <h2 className="text-4xl md:text-5xl font-sovngarde-bold mb-4">
              The Easiest Way to Play Tes3MP
            </h2> */}
                <div className="w-full h-full max-w-2xl mx-auto roudned-xl overflow-hidden">
                  <video
                    src="/nerevar-idle.webm"
                    autoPlay
                    loop
                    muted
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* <div className="text-center">
              <div className="text-4xl md:text-5xl font-sovngarde text-primary mb-2">
                {`10K+`}
              </div>
              <div className="text-muted-foreground">Server Scripts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-sovngarde text-primary mb-2">
                {`500+`}
              </div>
              <div className="text-muted-foreground">Shared Mod Packs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-sovngarde text-primary mb-2">
                {`100+`}
              </div>
              <div className="text-muted-foreground">Users</div>
            </div> */}
            {/* <div className="text-center">
              <div className="text-4xl md:text-5xl font-sovngarde text-primary mb-2">
                {`99.9%`}
              </div>
              <div className="text-muted-foreground">Reliability</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-sovngarde">
              {`Ready to Begin Your Journey?`}
            </h2>
            <p className="text-lg text-muted-foreground">
              {`The easiest way to setup, manage and share your Morrowind Multiplayer experience. Get the app now and start your journey today.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/kyaustad/Nerevar/releases"
                target="_self"
              >
                <Button size="lg" className="hover-lift">
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
              </Link>
              <Link href="https://github.com/kyaustad/Nerevar" target="_self">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover-lift"
                  // onClick={() => {
                  //   window.open("https://github.com/kyaustad/Nerevar", "_self");
                  // }}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.webp"
                alt="Nerevar Logo"
                width={32}
                height={32}
              />
              <span className="font-sovngarde text-lg">Nerevar</span>
            </div>
            <div className="flex items-center space-x-6">
              <Badge variant="secondary" className="torn-paper">
                Open Source
              </Badge>
              <Badge variant="outline">GPLv3 License</Badge>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted-foreground">
            <p>Built with passion for the Morrowind community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
