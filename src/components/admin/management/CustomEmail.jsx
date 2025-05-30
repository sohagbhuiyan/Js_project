import { useState } from "react";

const CustomEmail = () => {
   const [formData, setFormData] = useState({
        recipient: '',
        subject: '',
        content: ''
      });
      const [status, setStatus] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');

        try {
          // Simulate API call to send email
          // In a real app, replace with actual API endpoint, e.g.:
          // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(formData) });
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
          
          setStatus('Email sent successfully!');
          setFormData({ recipient: '', subject: '', content: '' });
        } catch (error) {
          setStatus('Failed to send email. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="p-6 md:ml-20 items-center max-w-xl">
          <h1 className="text-2xl font-bold mb-6">Custom Email</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                Recipient Email
              </label>
              <input
                type="email"
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email Subject"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="6"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your email content here..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>

            {status && (
              <p className={`mt-4 text-center ${status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                {status}
              </p>
            )}
          </form>
        </div>
  );
};

export default CustomEmail;
