import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
}

export function SEO({ title, description }: SEOProps) {
    useEffect(() => {
        // Update title
        document.title = `${title} | Golden Tier Peptide`;

        // Update or create description meta tag
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        }

        // Cleanup
        return () => {
            document.title = 'Golden Tier Peptide | Premium Research Supplies';
        };
    }, [title, description]);

    return null;
}
