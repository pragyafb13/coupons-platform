export const dynamic = "force-dynamic";

import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-10 w-10" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Disclaimer</h1>
              <p className="text-white/90 mt-1">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border-2 border-gray-200 p-8 sm:p-12">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">General Information</h2>
              <p className="leading-relaxed">
                The information contained on DealStack is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coupon Code Accuracy</h2>
              <p className="leading-relaxed mb-3">
                DealStack strives to provide accurate and up-to-date coupon codes and deals. However, we cannot guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All coupon codes are valid or will work at the time of use</li>
                <li>All deals are still available or in stock</li>
                <li>Retailers will honor the coupon codes or deals</li>
                <li>The information provided is error-free</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Coupon codes and deals are subject to change without notice. Retailers may modify, restrict, or cancel offers at any time. We recommend verifying the validity of a coupon code directly with the retailer before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="leading-relaxed">
                DealStack contains links to third-party websites. These links are provided for your convenience only. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. We are not responsible for the content, privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Warranty</h2>
              <p className="leading-relaxed">
                DealStack makes no warranty or representation, express or implied, regarding the website, its content, or the results that may be obtained from using the website. The website is provided "as is" without warranty of any kind, either express or implied, including but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed mb-3">
                In no event will DealStack, its owners, employees, or affiliates be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Loss of data or profits arising out of or in connection with the use of this website</li>
                <li>Use of or inability to use coupon codes or deals found on our website</li>
                <li>Transactions made with retailers using our coupon codes</li>
                <li>Any errors or omissions in the content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibility</h2>
              <p className="leading-relaxed">
                Users are solely responsible for verifying the validity, terms, and conditions of any coupon code or deal before use. DealStack is not responsible for any losses, damages, or inconveniences resulting from the use of coupon codes or deals found on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Relationships</h2>
              <p className="leading-relaxed">
                DealStack may have affiliate relationships with some retailers. This means we may earn a commission when you make a purchase through our links. This does not affect the price you pay or our editorial independence. We only recommend products and services we believe will be valuable to our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Disclaimer</h2>
              <p className="leading-relaxed">
                DealStack reserves the right to modify this disclaimer at any time. We will notify users of any changes by updating the "Last updated" date at the top of this page. Your continued use of the website after any changes constitutes acceptance of the new disclaimer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Disclaimer, please contact us at <a href="mailto:support@dealstack.com" className="text-blue-600 hover:underline">support@dealstack.com</a> or visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
