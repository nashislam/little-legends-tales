
import { CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Tell us about your child",
      description: "Enter your child's name, age, favorite animal, and interests",
      icon: "🧒"
    },
    {
      title: "Choose story elements",
      description: "Select a magical power, characters to include, and art style",
      icon: "✨"
    },
    {
      title: "Our AI creates your story",
      description: "Advanced AI generates a unique tale just for your little one",
      icon: "🤖"
    },
    {
      title: "Preview and download",
      description: "Review your personalized story and download as a PDF",
      icon: "📱"
    },
    {
      title: "Optional: Order a printed book",
      description: "Get a professionally printed hardcover version delivered to you",
      icon: "📚"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display mb-4">How Little Legends Works</h2>
          <p className="text-xl text-gray-600">
            Creating personalized stories for your child is simple and fun
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-3xl">
                {step.icon}
              </div>
              <div className="flex-1 container-card">
                <h3 className="font-display text-xl mb-2 text-legend-blue">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="container-card">
            <h3 className="font-display text-2xl text-legend-pink mb-4">Why Parents Love Us</h3>
            <ul className="space-y-3 text-left">
              {[
                "100% unique stories customized for your child",
                "Educational and entertaining content",
                "Promotes literacy and a love for reading",
                "Makes your child the hero of their own adventure",
                "Creates lasting memories and keepsakes"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-legend-green h-5 w-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
