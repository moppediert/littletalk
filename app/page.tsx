"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataConnection, Peer } from "peerjs";
import React from "react";

export default function Home() {
  const [self, setSelf] = React.useState<Peer>(() => new Peer());
  const [selfId, setSelfId] = React.useState<string>();
  const [conn, setConn] = React.useState<DataConnection | undefined>(undefined);
  const [peerId, setPeerId] = React.useState<string>("");

  const [messages, setMessages] = React.useState<
    {
      sender: string;
      message: string;
    }[]
  >([]);

  const onOpen = (id: string) => {
    setSelfId(id);
  };

  const onConnection = (dataConnection: DataConnection) => {
    console.log(`connection: ${dataConnection.connectionId}`);
    setPeerId(dataConnection.peer);
    setConn(dataConnection);
  };

  React.useEffect(() => {
    self.on("open", onOpen);
    self.on("connection", onConnection);
    return () => {
      self.off("open");
      self.off("connection");
    };
  }, [self]);

  const connect = (peerId: string) => {
    setConn(self?.connect(peerId));
  };

  const concatMessage = (sender: string, message: string) => {
    setMessages([
      ...messages,
      {
        sender,
        message,
      },
    ]);
  };

  const [message, setMessage] = React.useState("");
  const send = () => {
    conn?.send(message);
    concatMessage(self!.id, message);
    setMessage("");
  };

  React.useEffect(() => {
    conn?.on("data", function (data) {
      if (typeof data === "string") {
        concatMessage(peerId!, data);
      }
    });
    return () => {
      conn?.off("data");
    };
  }, [conn, messages, peerId]);

  return (
    <div className="border border-primary w-full h-full flex flex-col justify-center items-center gap-2">
      <span>{selfId}</span>
      <div className="flex w-[50%]">
        <Input
          placeholder="Peer ID"
          value={peerId}
          onChange={(e) => setPeerId(e.currentTarget.value)}
        ></Input>
        <Button onClick={() => connect(peerId!)}>Connect</Button>
      </div>

      <div className="border border-primary w-[50%] h-[80%] flex flex-col justify-center items-center p-2">
        <div className="flex-grow w-full">
          {messages.map((m, i) => {
            return (
              <div key={i} className="flex">
                <span className="font-bold">{m.sender}</span>
                <span>{": "}</span>
                <span>{m.message}</span>
              </div>
            );
          })}
        </div>
        <form
          className="flex w-full "
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            placeholder="Write something nice..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          ></Input>
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
