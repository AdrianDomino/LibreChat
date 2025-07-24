Usage Instructions

## Getting Started with the Memory Bank

### Overview
The LibreChat memory bank is a persistent context system that maintains project state, decisions, and progress across development sessions.

### Directory Structure
```
.kilocode/rules/memory-bank/
├── README.md              # Overview and structure
├── project-context.md     # Core project information
├── active-session.md      # Current session state
├── progress.md           # Task and progress tracking
├── patterns.md           # Code patterns and conventions
├── decisions.md          # Decision tracking
└── usage.md             # This file
```

### How to Use

#### Adding New Context
1. **Project Context**: Update `project-context.md` for any major project changes
2. **Session State**: Update `active-session.md` during active development
3. **Progress**: Update `progress.md` when tasks are completed or started
4. **Decisions**: Add new decisions to `decisions.md` with proper ADR format
5. **Patterns**: Document new patterns in `patterns.md`

#### Reading Context
- **Before starting work**: Check `active-session.md` for current session state
- **Understanding decisions**: Review `decisions.md` for architectural choices
- **Code patterns**: Refer to `patterns.md` for coding standards
- **Project overview**: Read `project-context.md` for project information

### Maintenance
- **Regular Updates**: Update relevant files as the project evolves
- **Consistency**: Maintain consistent formatting and structure
- **Accuracy**: Ensure all information is current and accurate

### Integration with Development
The memory bank integrates with the development workflow by:
- Providing context for new contributors
- Maintaining decision history
- Tracking progress across sessions
- Documenting patterns and conventions

### Best Practices
- **Keep it current**: Update files as changes occur
- **Be specific**: Provide clear, actionable information
- **Stay organized**: Follow the established structure
- **Review regularly**: Periodically review and update content