import { BounceLoader } from 'react-spinners';

const DashboardLoader = () => {
  return (
    <div className="absolute w-full h-screen inset-0 flex items-center justify-center bg-foreground bg-opacity-50">
      <BounceLoader color="#fff" />
    </div>
  );
};

export default DashboardLoader;
