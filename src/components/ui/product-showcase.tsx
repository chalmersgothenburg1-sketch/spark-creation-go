import smartwatchImage from "@/assets/smartwatch-product.jpg";

const ProductShowcase = () => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border max-w-xs">
      <div className="flex items-center justify-center mb-4">
        <img 
          src={smartwatchImage} 
          alt="SeniorCare Watch - Advanced health monitoring device"
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">SeniorCare Watch</h3>
        <p className="text-sm text-muted-foreground">Starting at $199</p>
      </div>
    </div>
  );
};

export default ProductShowcase;