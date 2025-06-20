'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from '../../SessionWrapper';

function ConceptsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Sample key concepts data
  const [concepts] = useState([
    {
      id: 1,
      term: "Photosynthesis",
      definition: "The process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
      category: "Plant Biology",
      importance: "High",
      relatedTerms: ["Chlorophyll", "Glucose", "Solar Energy"],
      examples: ["Green plants making food", "Leaves turning sunlight into energy"],
      tags: ["biology", "plants", "energy"]
    },
    {
      id: 2,
      term: "Cell Membrane",
      definition: "A biological membrane that separates the interior of all cells from the outside environment.",
      category: "Cell Biology",
      importance: "High",
      relatedTerms: ["Phospholipid Bilayer", "Selective Permeability", "Transport Proteins"],
      examples: ["Boundary of a cell", "Controls what enters and exits the cell"],
      tags: ["biology", "cell", "membrane"]
    },
    {
      id: 3,
      term: "Mitochondria",
      definition: "Organelles found in most eukaryotic cells, responsible for producing ATP through cellular respiration.",
      category: "Cell Biology",
      importance: "High",
      relatedTerms: ["ATP", "Cellular Respiration", "Powerhouse of Cell"],
      examples: ["Energy production in muscle cells", "Converting glucose to usable energy"],
      tags: ["biology", "cell", "energy", "organelle"]
    },
    {
      id: 4,
      term: "DNA",
      definition: "Deoxyribonucleic acid, the hereditary material that contains genetic instructions for living organisms.",
      category: "Genetics",
      importance: "Critical",
      relatedTerms: ["Genes", "Chromosomes", "Heredity", "Double Helix"],
      examples: ["Genetic information passed from parents", "Instructions for making proteins"],
      tags: ["biology", "genetics", "heredity"]
    },
    {
      id: 5,
      term: "Ecosystem",
      definition: "A community of living organisms interacting with their physical environment.",
      category: "Ecology",
      importance: "Medium",
      relatedTerms: ["Food Chain", "Biodiversity", "Habitat"],
      examples: ["Forest ecosystem", "Ocean ecosystem", "Desert ecosystem"],
      tags: ["biology", "ecology", "environment"]
    }
  ]);
  
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  
  // Get unique categories and tags
  const categories = ["All", ...new Set(concepts.map(c => c.category))];
  const allTags = concepts.flatMap(c => c.tags);
  const uniqueTags = ["All", ...new Set(allTags)];
  
  // Filter concepts
  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || concept.category === selectedCategory;
    const matchesTag = selectedTag === "All" || concept.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Key Concepts</h1>
            </div>
            <div className="text-sm text-gray-600">
              {filteredConcepts.length} concepts found
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search concepts..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedTag("All");
                  setSelectedConcept(null);
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Concepts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Concepts Library</h2>
                <p className="text-sm text-gray-600 mt-1">Click on a concept to view details</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto divide-y">
                {filteredConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedConcept?.id === concept.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{concept.term}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getImportanceColor(concept.importance)}`}>
                        {concept.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{concept.definition}</p>
                    <div className="flex flex-wrap gap-1">
                      {concept.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {concept.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{concept.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredConcepts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>No concepts found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setSelectedTag("All");
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Clear filters to see all concepts
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Concept Details */}
          <div className="lg:col-span-2">
            {selectedConcept ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedConcept.term}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getImportanceColor(selectedConcept.importance)}`}>
                      {selectedConcept.importance}
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedConcept.category}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Definition */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Definition</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedConcept.definition}</p>
                  </div>
                  
                  {/* Examples */}
                  {selectedConcept.examples && selectedConcept.examples.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Examples</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedConcept.examples.map((example: string, index: number) => (
                          <li key={index} className="text-gray-700">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Related Terms */}
                  {selectedConcept.relatedTerms && selectedConcept.relatedTerms.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Terms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConcept.relatedTerms.map((term: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm cursor-pointer hover:bg-blue-200 transition"
                            onClick={() => setSearchTerm(term)}
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedConcept.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => setSelectedTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-4 pt-4 border-t">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      🃏 Create Flashcard
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                      ❓ Generate Quiz
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                      🎵 Convert to Audio
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                      📋 Copy Definition
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Concept</h3>
                <p className="text-gray-500">Choose a concept from the list to view its details, examples, and related terms</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{concepts.length}</div>
            <div className="text-sm text-gray-600">Total Concepts</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{uniqueTags.length - 1}</div>
            <div className="text-sm text-gray-600">Tags</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {concepts.filter(c => c.importance === "Critical" || c.importance === "High").length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Concepts() {
  return (
    <SessionWrapper>
      <ConceptsContent />
    </SessionWrapper>
  );
}
