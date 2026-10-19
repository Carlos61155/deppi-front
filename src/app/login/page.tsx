import LoginAside from "@/components/login-aside";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="hidden w-1/2 lg:block">
          <LoginAside />
        </div>

        <div className="flex w-full items-center justify-center p-6 md:p-10 lg:w-1/2">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
