export function parseCSV(content: string): string[][] {
  const lines = content.split('\n')
  const result: string[][] = []
  
  for (const line of lines) {
    if (line.trim() === '') continue
    
    const row: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    row.push(current)
    result.push(row)
  }
  
  return result
}

export function parseTSV(content: string): string[][] {
  return content.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split('\t'))
}

export function stringifyCSV(data: string[][]): string {
  return data.map(row => 
    row.map(cell => {
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`
      }
      return cell
    }).join(',')
  ).join('\n')
}

export function stringifyTSV(data: string[][]): string {
  return data.map(row => row.join('\t')).join('\n')
}

export function detectFileType(filename: string): 'csv' | 'tsv' | null {
  const ext = filename.toLowerCase().split('.').pop()
  if (ext === 'csv') return 'csv'
  if (ext === 'tsv' || ext === 'tab') return 'tsv'
  return null
}
