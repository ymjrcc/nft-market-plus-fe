import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@nextui-org/button'; 

function Page() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <h1 className="text-3xl font-bold underline text-blue-600 text-center p-8">
        Hello Tailwindcss!
      </h1>
      <Button>Click me</Button>
    </>
  );
}

export default Page;
