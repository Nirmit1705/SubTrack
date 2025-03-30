import { motion } from 'framer-motion';
import { BarChart3, BellRing, Wallet2, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: BarChart3,
    title: "Visual Dashboard",
    description: "Get a clear overview of all your subscriptions with our intuitive dashboard.",
  },
  {
    icon: BellRing,
    title: "Smart Notifications",
    description: "Never miss a payment with customizable alerts and reminders.",
  },
  {
    icon: Wallet2,
    title: "Budget Tracking",
    description: "Keep your subscription spending in check with detailed analytics.",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Manage your subscriptions with one-click actions and shortcuts.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"> Better Management</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to take control of your subscriptions in one beautiful interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-colors">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}