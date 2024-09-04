const SectionTitle = ({ title, subtitle, underlineColor = 'bg-blue-500' }: { title: string, subtitle?: string, underlineColor?: string }) => {
  return (
    <div className="mx-auto">
      <div className="text-3xl font-bold text-gray-700 sm:text-4xl pb-2 mb-2 relative">
        {title}
        <span className={`absolute bottom-0 left-0 w-20 h-1 ${underlineColor}`}></span>
      </div>
      {subtitle && (
        <p className="text-xl text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;