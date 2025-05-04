"use client";

import { useState } from "react";
import CreationChatForm from "./CreationChatFrom";

export default function CreateChatButton() {
  const [visisble, setVisible] = useState<boolean>(false);

  return (
    <div className="relative">
      <button onClick={() => setVisible(true)}>Создать группу</button>
      {visisble && <CreationChatForm onFormClose={setVisible} />}
    </div>
  );
}
