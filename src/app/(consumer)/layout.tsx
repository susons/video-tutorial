import { Button } from "@/components/ui/button";
import { canAccessAdmin } from "@/permisions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

const ConsumerLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <>
    <Navbar />
    {children}
  </>
);
export default ConsumerLayout;

const Navbar = () => (
  <header className="flex h-12 shadow bg-background z-10">
    <nav className="flex gap-4 container">
      <Link
        href={"/"}
        className="mr-auto text-lg hover:underline px-2 flex items-center"
      >
        Courses
      </Link>

      <Suspense>
        <SignedIn>
          <AdminLink />
          <Link
            href="/courses"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            My courses
          </Link>
          <Link
            href="/purchases"
            className="hover:bg-accent/10 flex items-center px-2"
          >
            Purchase history
          </Link>
        </SignedIn>
        <div className="size-8 self-center">
          <UserButton />
        </div>
      </Suspense>
      <Suspense>
        <SignedOut>
          <Button className="self-center" asChild>
            <SignInButton>Sign in</SignInButton>
          </Button>
        </SignedOut>
      </Suspense>
    </nav>
  </header>
);

export const AdminLink = async () => {
  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) return null;

  return (
    <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
};
