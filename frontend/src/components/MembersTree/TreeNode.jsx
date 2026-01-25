import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Linkedin, User } from 'lucide-react';

const TreeNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = node.children && node.children.length > 0;

    const toggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className={`ml-${level * 4} my-2`}>
            <div
                className={`flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors border max-w-md ${hasChildren ? 'cursor-pointer' : ''} bg-white shadow-sm`}
                onClick={hasChildren ? toggleOpen : undefined}
            >
                {hasChildren && (
                    <span className="mr-2 text-orange-500">
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </span>
                )}

                {/* Avatar Placeholder or Image */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden border-2 border-orange-100">
                    {node.image ? (
                        <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} className="text-gray-400" />
                    )}
                </div>

                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{node.name}</h4>
                    <p className="text-xs text-orange-600 font-medium">{node.role}</p>
                    {node.domain && (
                        <p className="text-xs text-gray-500 mt-1">{node.domain}</p>
                    )}
                </div>

                {node.linkedin && (
                    <a
                        href={node.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0077b5] transition-colors p-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Linkedin size={18} />
                    </a>
                )}
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 pl-4 border-l-2 border-orange-100"
                    >
                        {node.children.map((child) => (
                            <TreeNode key={child.id} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TreeNode;
