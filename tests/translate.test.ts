
import { describe, it, expect, vi } from 'vitest';
import { translateAction } from '../app/actions/translate';

// Mock the GoogleGenerativeAI
const mockGenerateContent = vi.fn();
// Create a fake chain of properties/methods to match usage:
//   model.generateContent() -> result.response.text()
const mockGetGenerativeModel = vi.fn(() => ({
    generateContent: mockGenerateContent
}));

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}));

describe('translateAction', () => {
    it('returns empty string for empty input', async () => {
        const result = await translateAction('');
        expect(result).toBe('');
    });

    it('returns translated text on success', async () => {
        // Setup mock response
        mockGenerateContent.mockResolvedValueOnce({
            response: {
                text: () => 'My name is Dhaal'
            }
        });

        const result = await translateAction('Mera naam Dhaal hai');
        expect(mockGenerateContent).toHaveBeenCalled();
        expect(result).toBe('My name is Dhaal');
    });

    it('returns original text on error', async () => {
        // Mock a failure
        mockGenerateContent.mockRejectedValueOnce(new Error('API Failure'));

        const originalInfo = console.error;
        console.error = vi.fn(); // Suppress error logging

        const result = await translateAction('Hello');
        expect(result).toBe('Hello');

        console.error = originalInfo;
    });
});
