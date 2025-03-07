import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "@/data/env/server";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncUserClerkMetaData } from "@/app/services/clerk";

export async function POST(req: Request) {
  const SIGNING_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const email = evt?.data.email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )?.email_address;

      const name = `${evt?.data.first_name} ${evt.data.last_name}`.trim();

      if (!email)
        return new Response("Error: No email", {
          status: 400,
        });

      if (!name)
        return new Response("Error: No name", {
          status: 400,
        });

      if (evt.type === "user.created") {
        const user = await insertUser({
          clerkUserId: evt.data.id,
          email,
          name,
          imageUrl: evt.data.image_url,
          role: "user",
        });

        if (user) syncUserClerkMetaData(user);
      } else {
        await updateUser(
          { clerkUserId: evt.data.id },
          {
            email,
            name,
            imageUrl: evt.data.image_url,
            role: evt.data.public_metadata.role,
          }
        );
      }
      break;
    }
    case "user.deleted": {
      if (evt.data.id) await deleteUser({ clerkUserId: evt.data.id });
      break;
    }
  }

  return new Response("Success: User deleted", {
    status: 200,
  });
}
