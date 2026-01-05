#!/usr/bin/env python3
import json
import re
from pathlib import Path

import requests
from bs4 import BeautifulSoup


def unit_name_to_url(unit_name):
    """Convert unit name to URL slug format."""
    return unit_name.lower().replace(" ", "-")


def fetch_unit_page(unit_name):
    """Fetch HTML content for a unit page."""
    url_slug = unit_name_to_url(unit_name)
    url = f"https://mechamonarch.com/unit/{url_slug}/"
    
    try:
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch {url}: HTTP {response.status_code}")
        return response.text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error fetching {url}: {e}")


def extract_technologies(html_content):
    """Extract technologies from HTML content."""
    soup = BeautifulSoup(html_content, "html.parser")
    
    html_str = str(soup)
    start_marker = "<!-- tech loop start -->"
    end_marker = "<!-- tech loop end -->"
    
    start_idx = html_str.find(start_marker)
    end_idx = html_str.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        raise Exception("Could not find tech loop markers in HTML")
    
    tech_section = html_str[start_idx:end_idx]
    tech_soup = BeautifulSoup(tech_section, "html.parser")
    
    technologies = []
    tech_blocks = tech_soup.find_all("div", class_="highlight-light")
    
    if not tech_blocks:
        raise Exception("No technology blocks found in tech loop section")
    
    for block in tech_blocks:
        h3 = block.find("h3")
        if not h3:
            continue
        
        tech_name = h3.get_text(strip=True)
        if not tech_name:
            continue
        
        cost = None
        supply_img = block.find("img", alt="supply cost")
        if supply_img:
            br_tag = supply_img.find_next("br")
            if br_tag:
                next_sibling = br_tag.next_sibling
                while next_sibling and not str(next_sibling).strip():
                    next_sibling = next_sibling.next_sibling
                if next_sibling:
                    cost_text = str(next_sibling).strip()
                    cost_match = re.search(r"\d+", cost_text)
                    if cost_match:
                        try:
                            cost = int(cost_match.group())
                        except ValueError:
                            raise Exception(f"Could not parse cost as integer for technology '{tech_name}': {cost_match.group()}")
        
        if cost is None:
            raise Exception(f"Could not extract cost for technology '{tech_name}'")
        
        technologies.append({
            "name": tech_name,
            "cost": cost
        })
    
    if not technologies:
        raise Exception("No technologies extracted from tech loop section")
    
    return technologies


def main():
    """Main scraping function."""
    script_dir = Path(__file__).parent
    units_file = script_dir / "src" / "data" / "units.json"
    tech_file = script_dir / "src" / "data" / "technologies.json"
    
    with open(units_file, "r", encoding="utf-8") as f:
        units = json.load(f)
    
    all_technologies = set()
    units_with_techs = []
    
    for unit in units:
        unit_name = unit["name"]
        print(f"Processing {unit_name}...")
        
        try:
            html = fetch_unit_page(unit_name)
            technologies = extract_technologies(html)
            
            unit_techs = []
            for tech in technologies:
                tech_name = tech["name"]
                tech_cost = tech["cost"]
                unit_techs.append({
                    "name": tech_name,
                    "cost": tech_cost
                })
                all_technologies.add(tech_name)
            
            units_with_techs.append({
                "name": unit_name,
                "technologies": unit_techs
            })
            
            print(f"  Found {len(technologies)} technologies")
        
        except Exception as e:
            print(f"  Failed: {e}")
            units_with_techs.append({
                "name": unit_name,
                "technologies": []
            })
    
    technologies_list = sorted(list(all_technologies))
    
    with open(tech_file, "w", encoding="utf-8") as f:
        json.dump(technologies_list, f, indent=2, ensure_ascii=False)
    
    with open(units_file, "w", encoding="utf-8") as f:
        json.dump(units_with_techs, f, indent=2, ensure_ascii=False)
    
    print(f"\nScraping complete!")
    print(f"Total unique technologies: {len(technologies_list)}")
    print(f"Total units processed: {len(units_with_techs)}")


if __name__ == "__main__":
    main()

