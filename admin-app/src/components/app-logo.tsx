import Image from 'next/image';

interface AppLogoProps {
  width?: number;
  height?: number;
  text?: string;
  textPosition?: 'left' | 'right';
}

const AppLogo = ({
  width = 150,
  height = 150,
  text,
  textPosition = 'right',
}: AppLogoProps) => {
  return (
    <div
      className={`flex items-center gap-1 ${
        textPosition === 'left' ? 'flex-row-reverse' : ''
      }`}
    >
      <Image
        src="/images/app_logo.png"
        alt="CIT Logo"
        width={width}
        height={height}
      />
      {text && (
        <span className="text-primary text-2xl font-medium">{text}</span>
      )}
    </div>
  );
};

export default AppLogo;
