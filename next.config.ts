/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from "next";
import fs from "fs";
import os from "os";
import path from "path";

// Try to place build output on a local temp directory by creating
// a `.next` symlink inside the project that points to the OS temp folder.
const tempTarget = path.join(os.tmpdir(), "blood_donation_user_next");
try {
  fs.mkdirSync(tempTarget, { recursive: true });
} catch (e) {}

const projectNext = path.join(process.cwd(), ".next");
try {
  const exists = fs.existsSync(projectNext);
  if (!exists) {
    const type: fs.symlink.Type =
      process.platform === "win32" ? "junction" : "dir";
    fs.symlinkSync(tempTarget, projectNext, type);
  } else {
    const stat = fs.lstatSync(projectNext);
    if (stat.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(projectNext);
      if (path.resolve(linkTarget) !== path.resolve(tempTarget)) {
        try {
          fs.unlinkSync(projectNext);
          const type: fs.symlink.Type =
            process.platform === "win32" ? "junction" : "dir";
          fs.symlinkSync(tempTarget, projectNext, type);
        } catch (e) {}
      }
    }
    // If `.next` already exists as a directory/file, leave it alone.
  }
} catch (e) {}

const nextConfig: NextConfig = {
  // keep distDir default to `.next` so Next writes into our symlink (when created)
  distDir: ".next",
  images: {
    domains: [
      "ui-avatars.com",
      "randomuser.me",
      "api.dicebear.com",
      "lh3.googleusercontent.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
