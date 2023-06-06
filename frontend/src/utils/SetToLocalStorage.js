"use client";

import React, { useEffect } from "react";

export default function SetToLocalStorage({ user }) {
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, []);
}
