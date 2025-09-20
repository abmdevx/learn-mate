import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText } from "lucide-react";

const Copyright = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16 mt-3">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-6 w-6 text-gray-900" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Copyright & License
        </h1>

        {/* Body */}
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Ownership
            </h2>
            <p>
              This project, including all source code, designs, documentation,
              and related materials, is the exclusive property of{" "}
              <span className="text-orange-400 font-semibold">
                Abdullah Butt
              </span>.
              All rights are reserved unless explicitly stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Restrictions
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                You may <strong>view</strong> the source code for educational
                or evaluation purposes only.
              </li>
              <li>
                You may <strong>not copy, distribute, or reuse</strong> this
                code in whole or in part without prior written permission.
              </li>
              <li>
                Commercial use, production deployment, or redistribution of this
                project is strictly prohibited unless authorized.
              </li>
              <li>
                Videos, demos, or any media content related to this project
                cannot be duplicated, downloaded, or redistributed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Contributions
            </h2>
            <p>
              Community contributions are welcome through{" "}
              <span className="text-orange-400 font-semibold">
                pull requests
              </span>{" "}
              and{" "}
              <span className="text-orange-400 font-semibold">issues</span>.
              Suggestions, improvements, and bug reports are encouraged,
              provided they follow the project’s contribution guidelines.
              Submitting a contribution does not grant any ownership rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Licensing & Permission
            </h2>
            <p>
              If you would like to use this project in production, integrate it
              into a commercial product, or redistribute it in any form, you
              must obtain written consent or purchase a license directly from{" "}
              <span className="text-orange-400 font-semibold">
                Abdullah Butt
              </span>.
              Unauthorized use is a violation of copyright law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              Enforcement
            </h2>
            <p>
              Any unauthorized usage, copying, or distribution of this project
              will result in immediate legal action under applicable intellectual
              property and copyright laws.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Copyright;