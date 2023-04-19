import { Button } from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full h-[calc(100vh-4.75rem)]">
      <div className="flex items-center justify-center flex-1 px-8">
        <div>
          <h1 className="mb-6 text-4xl font-extrabold">Page not found</h1>
          <div className="mb-10">Sorry, we couldn&apos;t find the page you are looking for.</div>
          <Button href="/">Back to Homepage</Button>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 px-8 font-extrabold text-white bg-blue-600 text-9xl">
        404
      </div>
    </div>
  );
}
