// import Pusher from "pusher-js";

// let pusher: Pusher | null = null;

// export function getPusherClient() {
//   if (!pusher) {
//     pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
//       cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//       authEndpoint: "/api/pusher/auth",
//       forceTLS: true,
//     });
//   }
//   return pusher;
// }


import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export function getPusherClient() {
  if (!pusherClient) {
    pusherClient = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        forceTLS: true,
      }
    );
  }

  return pusherClient;
}
